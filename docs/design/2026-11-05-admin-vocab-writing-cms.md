# Admin Vocab & Writing CMS — mock UI + DB contract

**Phạm vi:** `web/admin` — mock only (giống Listen), **không** gọi API cho đến khi user yêu cầu nối BE.

**Cập nhật:** 2026-11-05

## Luồng màn hình (giống Listen)

| Bước | Listen | Vocab | Writing |
|------|--------|-------|---------|
| 1 | `/listen` — danh sách **section** (chương) | `/vocab` — danh sách **topic** (chủ đề) trong **level** | `/writing` — topic trong level |
| 2 | `/listen/sections/:id` — **bài học** | `/vocab/topics/:topicId` — **bài học** | `/writing/topics/:topicId` |
| 3 | `.../lessons/:lessonId` — metadata + **câu** | `.../lessons/:lessonId` — metadata + **từ** (`vocab_words`) | `.../lessons/:lessonId` — metadata + **câu** (`writing_sentences`) |

**Query URL:** `?lang=en|zh|jp&level=<levelCode>` — level cố định theo learner app (không tạo level mới trên admin).

### Level hiển thị (mirror `web/app`)

| Lang | Vocab / Writing levels |
|------|-------------------------|
| `en` | A1, A2, B1, B2, C1, C2 |
| `zh` | HSK1 … HSK9 |
| `jp` | N5, N4, N3, N2, N1 |

Nguồn FE learner: `web/app/src/lib/learn/vocab/levels.ts`, `web/app/src/lib/learn/writing/levels.ts`.  
Admin mirror: `web/admin/src/features/vocab/lib/vocab-levels.ts`, `web/admin/src/features/writing/lib/writing-levels.ts`.

---

## Vocab — lưu DB thế nào?

Từ vựng **không** nằm chung bảng lesson; mỗi từ là một row **`vocab_words`** (FK `lesson_id` → `vocab_lessons`).

```
vocab_curricula (language_code + level_code)
  └── vocab_topics (slug, title, sort_order, is_published)
        └── vocab_lessons (slug, story_id, title, description, word_count, next_story_*, …)
              └── vocab_words (slug, term, ipa, part_of_speech, meaning_vi, definition, example, example_vi, collocations jsonb, distractors jsonb, sort_order)
```

**Progress user** (admin UI không edit): `user_vocab_lesson_progress`, `user_vocab_weak_items` → FK `vocabulary_word_id` → `vocab_words.id`.

---

## Writing — lưu DB thế nào?

```
writing_curricula
  └── writing_topics
        └── writing_lessons (content_id, level_code, script_modes jsonb, sentence_count, …)
              └── writing_sentences (prompt_vi, target_default, targets_by_mode jsonb, pronunciation_kind, pronunciation jsonb, sort_order)
```

---

## Admin API (khi nối sau)

| Skill | Method | Path |
|-------|--------|------|
| Vocab | GET | `/v1/admin/languages/:languageCode/vocab/:levelCode` → `{ curriculum, topics: [{ topic, lessons }] }` |
| Vocab | GET | `/v1/admin/languages/:languageCode/vocab/lessons/:lessonId` → `{ lesson, words }` |
| Vocab | PATCH | `.../lessons/:lessonId` → `updateVocabLessonBodySchema` |
| Vocab | PUT | `.../lessons/:lessonId/words` → `upsertVocabWordsBodySchema` |
| Writing | GET | `/v1/admin/languages/:languageCode/writing/:levelCode` |
| Writing | GET | `.../writing/lessons/:lessonId` → `{ lesson, sentences }` |
| Writing | PUT | `.../lessons/:lessonId/sentences` → `upsertWritingSentencesBodySchema` |

Schema Zod: `src/modules/vocab/vocab.admin.dto.ts`, `src/modules/writing/writing.admin.dto.ts`.  
Drizzle: `src/db/schema/vocab.ts`, `src/db/schema/writing.ts`.

**Chưa có admin API:** tạo topic/lesson mới (Listen mock có dialog; vocab/write mock append local — backlog BE).

---

## Bảng cột UI ↔ DB / DTO

### Vocab — topic list (`vocab_topics` + aggregate)

| Cột UI | DB / mock field |
|--------|-----------------|
| Tiêu đề | `title` |
| Slug | `slug` |
| Thứ tự | `sort_order` |
| Bài | `lesson_count` (count `vocab_lessons`) |
| Trạng thái | `is_published` |

### Vocab — lesson list (`vocab_lessons`)

| Cột UI | DB |
|--------|-----|
| Tiêu đề | `title` |
| Slug | `slug` |
| Story ID | `story_id` (learner story key) |
| Từ | `word_count` |
| Thứ tự | `sort_order` |
| Trạng thái | `is_published` |

### Vocab — lesson detail

| Form field | DB column | Admin PATCH |
|------------|-----------|-------------|
| Tiêu đề | `title` | ✓ |
| Slug | `slug` | ✓ |
| Mô tả | `description` | ✓ |
| Story ID | `story_id` | ✓ |
| Số từ (read-only sync) | `word_count` | ✓ optional |
| Next story | `next_story_id`, `next_story_title` | ✓ |
| Thứ tự | `sort_order` | ✓ |
| Xuất bản | `is_published` | ✓ |

### Vocab — từ (`vocab_words`) — panel bảng

| Cột | DB | PUT body (`vocabWordInputSchema`) |
|-----|-----|-----------------------------------|
| Slug | `slug` | `slug` |
| Từ | `term` | `term` |
| IPA | `ipa` | `ipa` |
| Loại từ | `part_of_speech` | `partOfSpeech` |
| Nghĩa VI | `meaning_vi` | `meaningVi` |
| Định nghĩa EN | `definition` | `definition` |
| Ví dụ | `example` | `example` |
| Ví dụ VI | `example_vi` | `exampleVi` |
| Collocations | `collocations` jsonb | `collocations[]` |
| Distractors | `distractors` jsonb | `distractors[]` |
| Thứ tự | `sort_order` | `sortOrder` |

**Không có audio** cho vocab (scope: TTS browser).

---

### Writing — topic / lesson list

Topic: giống vocab (`writing_topics`).  
Lesson list: `title`, `slug`, `content_id`, `sentence_count`, `sort_order`, `is_published`.

### Writing — lesson detail

| Form field | DB |
|------------|-----|
| Tiêu đề | `title` |
| Slug | `slug` |
| Content ID | `content_id` |
| Level | `level_code` |
| Script modes | `script_modes` jsonb |
| Xuất bản | `is_published` |

### Writing — câu (`writing_sentences`)

| Cột UI | DB | PUT (`writingSentenceInputSchema`) |
|--------|-----|-------------------------------------|
| Gợi ý VI | `prompt_vi` | `promptVi` |
| Đáp án | `target_default` | `targetDefault` |
| Theo mode | `targets_by_mode` | `targetsByMode` |
| Loại phiên âm | `pronunciation_kind` | `pronunciationKind` |
| Phiên âm | `pronunciation` jsonb | `pronunciation[]` |
| Thứ tự | `sort_order` | `sortOrder` |

---

## File map (admin)

### Vocab

- `features/vocab/lib/vocab-cms-mock.ts` — types + mock EN A1 (Food & Shopping)
- `features/vocab/lib/vocab-cms-hrefs.ts`
- `features/vocab/lib/vocab-levels.ts`, `vocab-language-preference.ts`
- `features/vocab/context/vocab-cms-context.tsx`
- `features/vocab/components/*` — header, tables, dialogs, lesson form, words panel
- `app/(dashboard)/vocab/layout.tsx`, `page.tsx`, `topics/...`

### Writing

- Mirror under `features/writing/` + `app/(dashboard)/writing/`

---

## Mock seed tham chiếu

- Vocab EN A1: `scripts/seed-vocab.ts` (topic Food & Shopping, 4 lessons)
- Writing EN A1: `scripts/seed-writing.ts`

Admin mock dùng id/slug **tương thích** seed để sau nối API không lệch field.
