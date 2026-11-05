# Listen — user progress, guest merge, settings, admin CMS, search

Thiết kế **implement sau**; không chặn MVP mock 1 bài EN. CN/JP dùng cùng contract, khác `language_code` + seed.

Liên quan:

- `docs/design/2026-11-04-listening-sections-lazy-load.md` — tầng 1/2, guest policy, merge sketch
- `docs/design/2026-11-04-learning-content-schema-en-zh-jp.md` §1.4 — progress fields
- `docs/design/2026-11-04-listening-lesson-detail-mock.md` — playback settings shape (FE)
- `docs/database-design.md` — phase 2 stub

**Out of scope doc này:** XP tổng, khung avatar theo level, leaderboard — thiết kế riêng khi có profile/shop UI (xem §9).

---

## 1. Goals

| Mục | Mục đích |
|-----|----------|
| **Progress user** | Resume câu, hoàn thành bài, section `completed_count` khi login |
| **Guest → login** | Merge 2 store localStorage lên server một lần |
| **Admin CMS read** | Admin UI list/tree/import; hiện chỉ CUD |
| **Playback settings** | Cùng shape FE; guest local → `user_settings` khi có session |
| **Star / completion_count** | User-owned trên progress row; khác `listening_lessons.stars` (catalog) |
| **Full-text search** | Scale search title (sau transcript); MVP giữ `ilike` |

---

## 2. Schema (Drizzle)

### 2.1 `user_listen_lesson_progress`

PK `(user_id, lesson_id)`. `user_id` → Better Auth `user.id`. `lesson_id` → `listening_lessons.id`.

| Column | Type | Notes |
|--------|------|--------|
| `user_id` | text | |
| `lesson_id` | text FK | |
| `status` | text | `not_started` \| `in_progress` \| `completed` |
| `completed_sentence_count` | int | default 0 |
| `last_sentence_position` | int | 1-based; resume player |
| `last_position_ms` | int nullable | optional seek trong file |
| `completion_count` | int | default 0 — số lần **hoàn thành full bài** (replay) |
| `completion_cycle_active` | boolean | default true — vòng dictation hiện tại; false sau complete, bật lại khi “Làm lại” |
| `is_starred` | boolean | default false |
| `star_count` | smallint | 0–5 — **đánh giá user**, không phải catalog |
| `completed_at` | timestamptz nullable | lần complete gần nhất |
| `created_at` / `updated_at` | timestamptz | |

Index: `(user_id, lesson_id)` PK; `(lesson_id)` cho aggregate section; `(user_id, updated_at DESC)` optional.

**Quy ước complete lesson:** Player gọi API khi user hoàn thành câu cuối (hoặc nút hoàn thành): `status = completed`, `completed_sentence_count = listening_lessons.sentence_count`, set `completed_at`. Nếu user “làm lại” từ đầu: `completion_cycle_active = true`, reset sentence count in-cycle; khi complete lại → `completion_count += 1`.

**Catalog stars:** `listening_lessons.stars` giữ nguyên — metadata card (seed/admin), **không** ghi đè bởi user.

### 2.2 `user_listen_sentence_attempts` (optional phase 2.1)

Analytics / lịch sử chấm — không bắt buộc MVP progress.

| Column | Type |
|--------|------|
| `id` | uuid PK |
| `user_id` | text |
| `sentence_id` | uuid FK → `listening_sentences` |
| `lesson_id` | text FK |
| `user_input` | text |
| `is_correct` | boolean |
| `duration_ms` | int nullable |
| `created_at` | timestamptz |

Index `(user_id, lesson_id, created_at)`.

### 2.3 `user_settings`

Một row / user (hoặc jsonb trên `user_profiles` — chọn **một** nơi; đề xuất bảng riêng để merge partial PATCH dễ).

| Column | Type |
|--------|------|
| `user_id` | text PK |
| `preferences` | jsonb |
| `updated_at` | timestamptz |

**`preferences.listeningPlayback`** — mirror `ListeningPlaybackSettings` (`web/app/src/lib/learn/listening/listening-playback-settings.ts`):

```ts
type ListeningPlaybackSettings = {
  playPauseKey: "Space" | "Ctrl" | "Enter" | "Esc"
  replayKey: ListeningPlaybackKey
  checkNextKey: ListeningPlaybackKey
  skipKey: ListeningPlaybackKey
  autoReplay: boolean
  replayGapSeconds: 0.5 | 1 | 1.5 | 2
  showShortcutTips: boolean
  showRestartFromBeginning: boolean
}
```

Version key trong jsonb: `preferences._version = 1`. Skill khác sau: `preferences.vocab`, …

### 2.4 Full-text (migration path)

Bảng `listening_lessons`:

| Column | Type | Notes |
|--------|------|--------|
| `search_vector` | tsvector | generated hoặc trigger maintain |

Giai đoạn 1 (MVP): **`ilike(title)`** như hiện tại — không cột tsvector.

Giai đoạn 2: populate `search_vector` từ `title` (+ optional `metadata->>'description'`). Index GIN (`search_vector`). Query `plainto_tsquery('simple', :q)` hoặc `websearch_to_tsquery` nếu cần tiếng Việt sau.

Giai đoạn 3 (optional): aggregate transcript từ `listening_sentences` vào vector riêng hoặc bảng `listening_lesson_search` — chỉ khi product cần search nội dung câu.

---

## 3. User API (auth: Better Auth session)

Prefix: `/v1/user/listening` (hoặc `/v1/me/listening` — chọn một, document cả repo).

### 3.1 Lesson progress

| Method | Path | Body / response |
|--------|------|-----------------|
| GET | `/lessons/:lessonId/progress` | `{ progress: UserListenLessonProgress \| null }` |
| PUT | `/lessons/:lessonId/progress` | Partial: `status`, `completedSentenceCount`, `lastSentencePosition`, `lastPositionMs`, `completionCycleActive` |
| POST | `/lessons/:lessonId/complete` | Idempotent complete vòng hiện tại → bump `completion_count` nếu re-complete policy (xem §2.1) |
| POST | `/lessons/:lessonId/restart` | Reset in-cycle fields; `completion_cycle_active = true` |
| PATCH | `/lessons/:lessonId/star` | `{ isStarred?: boolean, starCount?: 0..5 }` |

Response DTO camelCase cho FE; map từ snake DB.

### 3.2 Public catalog khi có session

Mở rộng **existing** public routes (optional auth middleware):

- `GET .../categories/:slug` — sections: `completedCount` per user (SQL aggregate §4).
- `GET .../sections/:sectionId/lessons` — mỗi lesson: `progress?: { status, completedSentenceCount, isCompleted }`.

Guest: không session → `completedCount` omitted hoặc 0; FE vẫn cộng localStorage.

### 3.3 Guest merge

`POST /v1/user/listening/guest-progress/merge`

**Auth required.** Gọi **một lần** sau sign-up / first login nếu local store non-empty.

Body:

```ts
type GuestProgressMergeBody = {
  /** Section/card progress — key dailytaka:guest-listening-progress:v1 */
  lessonEntries: GuestListeningProgressEntry[]
  /** In-player resume — key dailytaka:guest-dictation-lesson-progress:v1 */
  dictationEntries: GuestDictationLessonProgress[]
  /** Optional — nếu client gửi kèm lần merge đầu */
  playbackSettings?: ListeningPlaybackSettings
}
```

`GuestListeningProgressEntry` / `GuestDictationLessonProgress` — giữ shape FE hiện tại (`web/app/src/lib/learn/listening/guest-*.ts`).

Server:

1. Validate mỗi `lessonId` tồn tại, khớp `language` + `categorySlug` + `sectionId`.
2. Upsert `user_listen_lesson_progress` — **max progress wins:**
   - `completed` beats `in_progress`
   - higher `completed_sentence_count` wins
   - merge `last_sentence_position` / dictation `currentSentenceIndex` + `correctCount` vào cột tương ứng
3. Nếu `playbackSettings` present → merge vào `user_settings.preferences.listeningPlayback` (server wins on conflict optional: **client guest settings win** lần merge đầu).
4. Response `{ mergedLessons: number, skipped: number, settingsMerged: boolean }`
5. FE xóa 3 localStorage keys sau success.

Hook: client `useEffect` sau session established; idempotent (merge lại không downgrade server).

### 3.4 Playback settings (account)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/v1/user/settings` | `{ preferences: { listeningPlayback?: ... } }` |
| PATCH | `/v1/user/settings` | Partial jsonb merge |

FE: logged-in → read server on load; PATCH debounced on change. Logged-out → giữ `dailytaka:listening-playback-settings:v1`.

---

## 4. SQL aggregate — section `completedCount`

Khi user authenticated, `getCategoryDetail` join:

```sql
SELECT s.id, COUNT(l.id) AS lesson_count,
       COUNT(p.lesson_id) FILTER (WHERE p.status = 'completed') AS completed_count
FROM listening_sections s
JOIN listening_lessons l ON l.section_id = s.id
LEFT JOIN user_listen_lesson_progress p
  ON p.lesson_id = l.id AND p.user_id = $user_id
WHERE s.category_id = $category_id
GROUP BY s.id, s.sort_order
ORDER BY s.sort_order;
```

Denormalize `user_listen_section_stats` chỉ khi profile query chậm — không MVP.

---

## 5. Admin CMS API (read + write)

Prefix: `/v1/admin/languages/:languageCode/listening` — giữ `requireAdminAuth()`.

### 5.1 Read (mới)

| Method | Path | Response |
|--------|------|----------|
| GET | `/categories` | `{ categories: ListeningCategoryAdminRow[] }` |
| GET | `/categories/:categoryId` | category + `{ sections: SectionWithLessonCount[] }` |
| GET | `/sections/:sectionId` | section + `{ lessons: LessonAdminSummary[] }` |
| GET | `/lessons/:lessonId` | lesson + `{ sentences: SentenceRow[] }` |

Admin row includes: `isPublished`, `audioStorageKey`, `metadata`, internal ids — không leak ra public DTO.

### 5.2 Write (đã có — giữ)

POST/PATCH/DELETE category, section, lesson; PUT `/lessons/:lessonId/sentences`; PATCH/DELETE sentence.

### 5.3 CMS follow-ups (phase admin 2)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/lessons/:lessonId/audio/upload-url` | Presigned PUT → client upload MP3 → PATCH lesson `audioStorageKey` |
| POST | `/lessons/import-package` | SRT + audio metadata bulk (design package shape từ §1.3 learning-content-schema) |

Invalidate / recompute `listening_categories.lesson_count`, `listening_lessons.sentence_count` on admin writes.

---

## 6. Search — behavior

**Hiện tại:** `searchLessons` — `ilike` title + filter level.

**Phase full-text:** repository method switch on env `LISTENING_SEARCH_MODE=ilike|fts`. FTS query:

```sql
WHERE category_id = $1
  AND ($level = 'all' OR level_code = $level)
  AND search_vector @@ plainto_tsquery('simple', $q)
ORDER BY ts_rank(search_vector, plainto_tsquery('simple', $q)) DESC
LIMIT 50;
```

API response shape **không đổi** (`ListeningLessonSearchResponse`).

Reindex job: admin sau bulk import lessons.

---

## 7. Frontend wiring (khi implement)

| Store / UI | API |
|------------|-----|
| `useGuestDictationProgress` | logged-in: PUT progress; guest: local only |
| `guest-listening-progress` | merge on login |
| `listening-playback-settings` | PATCH settings when session |
| `section-panel` `completedCount` | API + guest fallback |
| `lesson-card` catalog `stars` | vẫn từ lesson list API (catalog) |
| User star UI (future) | PATCH star endpoint |

---

## 8. Test scenarios

1. Guest complete 1 lesson → local entries; section header 1/N (FE).
2. Login merge → DB row `completed`; GET category `completedCount` = 1.
3. Merge conflict: server `completed`, guest `in_progress` → giữ completed.
4. Dictation resume: guest `correctCount` + index → merge → GET progress khớp.
5. Complete twice → `completion_count = 2`, `status = completed`.
6. PATCH star → persisted; catalog `lesson.stars` unchanged.
7. PATCH playback → GET settings; new device same keys.
8. Search: ilike và FTS trả cùng shape; FTS rank “snow” trước unrelated.
9. Admin GET tree → lesson detail 21 sentences khớp public GET.

---

## 9. XP / khung avatar (deferred)

**Không thuộc doc này.** Có thể thiết kế sau khi:

- `user_listen_lesson_progress` + `user_daily_activity` (streak doc) ổn định
- Product chốt: XP từ skill nào, cap/ngày, có tier theo **proficiency** (A1…) hay **account level** (gamification)

Khung viền avatar thường là:

- `user_profiles` hoặc `user_cosmetics`: `equipped_frame_id`
- Bảng `cosmetic_frames`: `id`, `unlock_rule` (level ≥ N, streak, paid)
- **Chỉ FE asset + enum** — không khó nếu tách khỏi progress listen

Implement listen progress **không** phụ thuộc cosmetics.

---

## 10. Implementation order

1. Migration: `user_listen_lesson_progress`, `user_settings`
2. User progress GET/PUT/complete + wire player (auth)
3. Public category/lessons optional auth + `completedCount`
4. `POST guest-progress/merge` + client hook
5. GET/PATCH user settings (playback)
6. Admin GET tree
7. `star` PATCH + UI (optional)
8. FTS column + index + search repo switch
9. Sentence attempts + admin upload/import (optional)

---

## 11. References (code)

- Public routes: `src/modules/listening/listening.routes.ts`
- Admin write: `src/modules/listening/listening.admin.routes.ts`
- Guest stores: `web/app/src/lib/learn/listening/guest-listening-progress.ts`, `guest-dictation-lesson-progress.ts`
- Playback: `web/app/src/lib/learn/listening/listening-playback-settings.ts`
