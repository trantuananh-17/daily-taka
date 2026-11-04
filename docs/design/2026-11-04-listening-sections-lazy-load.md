# Feature: Listening category detail — sections (2-tier) + progress + guest

Trang `/:language/listen/:categorySlug` (vd. `en/listen/short-stories`): accordion section, lazy lessons, search server-side, guest preview, merge progress sau đăng ký.

Liên quan: [database-design.md](../database-design.md) (`dictation_collections` → `dictation_sections` → `dictation_lessons`), mock UI `web/app/src/features/listen/category/*`.

---

## Goal

- **Tầng 1:** load nhẹ — danh sách section + progress tổng (`completed_count` / `lesson_count`) **không** cần load từng story.
- **Tầng 2:** mở section → load danh sách lesson (card metadata); **skeleton** trên FE trong lúc chờ.
- **Search / lọc level:** server search, không tải full catalog.
- **Guest:** làm thử 1–2 section + vài story; progress tạm **localStorage**; sau **login / đăng ký lần đầu** merge lên server.
- **Chưa** pagination trong section (≤ ~20 bài/section).

---

## Progress: làm sao biết `0/15` mà chưa mở section?

**Không** cần payload lesson ở tầng 1. Chỉ cần **aggregate SQL** (hoặc cột denormalized cập nhật khi user hoàn thành bài).

### Quy ước “hoàn thành 1 story (lesson)”

Một hàng `user_dictation_lesson_progress`:

| Cột | Ghi chú |
|-----|--------|
| `user_id`, `lesson_id` | PK hoặc unique |
| `completed_sentence_count` | optional |
| `total_sentence_count` | snapshot lúc bắt đầu hoặc join `dictation_lessons.sentence_count` |
| `status` | `not_started` \| `in_progress` \| `completed` |
| `completed_at` | set khi `status = completed` |
| `last_sentence_index` | resume player |

**Lesson = completed** khi `status = 'completed'` (hoặc `completed_sentence_count >= sentence_count`). Player ghi progress khi submit câu cuối / nút hoàn thành.

### Section header: `completed_count` / `lesson_count`

| Field | Nguồn |
|-------|--------|
| `lesson_count` | `COUNT(dictation_lessons)` WHERE `section_id = ?` — hoặc denormalized `dictation_sections.lesson_count` (admin sync) |
| `completed_count` (user) | `COUNT(progress)` JOIN lessons WHERE section + user + completed |

**Query mẫu (một round-trip cho cả category):**

```sql
SELECT
  s.id,
  s.title,
  s.order_index,
  s.lesson_count,  -- denormalized, hoặc subquery count
  COALESCE agg.completed_count, 0) AS completed_count
FROM dictation_sections s
LEFT JOIN (
  SELECT l.section_id, COUNT(*) FILTER (WHERE p.status = 'completed') AS completed_count
  FROM dictation_lessons l
  LEFT JOIN user_dictation_lesson_progress p
    ON p.lesson_id = l.id AND p.user_id = $user_id
  WHERE l.collection_id = $collection_id
  GROUP BY l.section_id
) agg ON agg.section_id = s.id
WHERE s.collection_id = $collection_id
ORDER BY s.order_index;
```

**Guest (chưa login):** API tầng 1 **không** trả `completed_count` server (hoặc luôn 0). FE tính từ localStorage (xem dưới).

**Không** join full `dictation_sentences` — chỉ bảng progress + lessons.

### Tầng 2 (danh sách lesson trong section)

Khi user đã login, mỗi lesson card có thể thêm progress nhẹ (optional, cùng request):

```sql
SELECT l.id, l.slug, l.title, l.sentence_count, l.cefr_level, l.sort_order,
       p.status, p.completed_at
FROM dictation_lessons l
LEFT JOIN user_dictation_lesson_progress p
  ON p.lesson_id = l.id AND p.user_id = $user_id
WHERE l.section_id = $section_id
ORDER BY l.sort_order;
```

Section header vẫn lấy từ tầng 1; tầng 2 chỉ để hiển thị tick/trạng thái từng card (nếu cần).

---

## API contracts

Base: `/languages/:code/listening/categories/:categorySlug`

| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `.../sections` | optional | Tầng 1 — sections + counts |
| GET | `/languages/:code/listening/sections/:sectionId/lessons` | optional | Tầng 2 — lessons trong 1 section |
| GET | `.../lessons/search` | optional | `q`, `level`, `sectionId?` |
| POST | `/user/listening/guest-progress/merge` | required | Merge localStorage sau login lần đầu |

### `GET .../sections` — response

```ts
type ListeningSectionsResponse = {
  category: { id: string; slug: string; name: string }
  sections: ListeningSectionSummary[]
  guest?: GuestAccessPolicy
}

type ListeningSectionSummary = {
  id: string
  title: string
  sortOrder: number
  lessonCount: number
  /** Chỉ khi có session user */
  completedCount?: number
  /** Guest / paywall */
  access: "full" | "preview" | "locked"
}

type GuestAccessPolicy = {
  maxSectionSortOrder: number      // vd. 2 → section 1–2 preview
  maxLessonsPerPreviewSection: number  // vd. 3 story / section preview
  requiresLoginAfterLessonIds?: string[] // optional explicit allow-list
}
```

### `GET .../sections/:sectionId/lessons`

```ts
type ListeningSectionLessonsResponse = {
  sectionId: string
  lessons: ListeningLessonSummary[]
}

type ListeningLessonSummary = {
  id: string
  slug: string
  index: number
  title: string
  sentenceCount: number
  level: string
  stars?: number
  access: "full" | "preview" | "locked"
  progress?: { status: "not_started" | "in_progress" | "completed" }
}
```

- **Guest:** section `locked` → 403 hoặc `lessons: []` + `access: locked`.
- **Guest preview section:** trả tối đa `maxLessonsPerPreviewSection` bài `access: full`, còn lại `locked` (hoặc ẩn — product chọn).

### `GET .../lessons/search`

Query: `q` (title), `level` (CEFR), optional `sectionId`.

```ts
type ListeningLessonSearchResponse = {
  query: { q: string; level: string | null }
  hits: Array<
    ListeningLessonSummary & {
      sectionId: string
      sectionTitle: string
    }
  >
  sectionMatchCount: number  // “17 phần phù hợp” — distinct sections có ≥1 hit
}
```

Index: `(collection_id)`, GIN/tsvector trên `dictation_lessons.title` (optional).

---

## Guest + localStorage + merge

### Policy (config server hoặc env)

Ví dụ Short Stories EN:

- Section 1–2: `access: preview` hoặc `full` với cap 3 lesson playable.
- Section 3+: `locked` until login.
- Sau khi guest hoàn thành N story hoặc mở lesson locked → modal đăng nhập.

### Local storage key

`dailytaka:guest-listening-progress:v1`

```ts
type GuestListeningProgressStore = {
  version: 1
  updatedAt: string // ISO
  entries: GuestListeningProgressEntry[]
}

type GuestListeningProgressEntry = {
  language: "en" | "zh" | "jp"
  categorySlug: string
  lessonId: string
  sectionId: string
  status: "in_progress" | "completed"
  completedSentenceCount?: number
  totalSentenceCount?: number
  lastSentenceIndex?: number
  completedAt?: string
}
```

- Player guest: ghi/ cập nhật entry khi làm bài.
- **Section `completed_count` (guest):** FE đếm `entries` với `sectionId` + `status === 'completed'` (chỉ lesson id guest đã thấy / allow-list — không cần load hết lesson tầng 2 nếu chỉ cần header: có thể lưu thêm `completedLessonIdsBySection` trong store).

### Merge sau login (lần đầu)

`POST /user/listening/guest-progress/merge`

Body: `{ entries: GuestListeningProgressEntry[] }`

Server:

1. Validate `lesson_id` tồn tại, thuộc đúng language/category.
2. **Upsert** `user_dictation_lesson_progress` — rule **max progress wins** (completed beats in_progress; higher sentence count wins).
3. Trả `{ merged: number, skipped: number }`.
4. FE xóa localStorage key sau success.

Hook: Better Auth `afterSignUp` / client gọi merge một lần nếu store non-empty.

---

## Frontend behavior (mock → API)

| Hành vi | Ghi chú |
|---------|--------|
| Vào trang | `getSections()` — mock → fetch tầng 1 |
| Mở section | `getSectionLessons(sectionId)`; state `loading` → **Skeleton** grid (3 cột desktop, 1 mobile), ~6–9 placeholder cards |
| Search debounce | Gọi `searchLessons`; render hits grouped hoặc flatten; `sectionMatchCount` |
| Đóng/mở section | Cache in-memory (Map) hoặc React Query `staleTime` |
| Guest header progress | `completedCount` từ localStorage merge với `lessonCount` từ API |

Skeleton: shadcn `Skeleton` trong `SectionPanel` khi `isOpen && isLoading`.

---

## Denormalization (optional, scale sau)

- `dictation_sections.lesson_count` — cập nhật khi admin thêm/xóa lesson.
- `user_dictation_section_stats` (user_id, section_id, completed_count) — cập nhật khi lesson completed; tầng 1 đọc bảng này thay subquery (khi user rất nhiều lesson).

Giai đoạn đầu **JOIN + COUNT** đủ cho ~300 lesson / user.

---

## Test scenarios

1. **Anonymous** — `GET sections`: có `lesson_count`, không có `completed_count`; section 3+ `locked`.
2. **Open section 1** — lessons load; guest chỉ 3 bài `full`, còn lại locked.
3. **Guest hoàn thành 1 lesson** — localStorage có entry; section 1 header `1/15` (FE).
4. **Login + merge** — server progress; `GET sections` trả `completed_count: 1`.
5. **User completed 5 lessons in section 2 without opening accordion before** — tầng 1 vẫn `5/15` nhờ aggregate, chưa cần tầng 2.
6. **Search `q=snow`** — hits cross-section; không tải toàn bộ lessons.
7. **Merge conflict** — server completed, guest in_progress → giữ completed.

---

## Implementation order

1. DB: đảm bảo `user_dictation_lesson_progress.status` + index `(user_id, lesson_id)`, `(section_id)` qua FK lesson.
2. API: `sections` + `sections/:id/lessons` + `search`.
3. FE: client fetch tầng 2 + skeleton; wire guest store + merge call.
4. Admin: CRUD section/lesson (invalidate `lesson_count`).
