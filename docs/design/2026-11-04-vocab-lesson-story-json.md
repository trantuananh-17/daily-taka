# Vocab lesson story JSON (mock → DB)

Payload shape for one vocabulary **story** (batch), used in `web/app/src/lib/learn/vocab/mock/stories/`.

## Lesson

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | e.g. `lesson-01` |
| `title` | string | Display title |
| `description` | string | Overview copy |
| `words` | array | See below |
| `nextStory` | `{ id, title }?` | Optional sequence |

## Word

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | Stable id |
| `term` | string | English headword |
| `ipa` | string | Phonetic (shown beside term) |
| `partOfSpeech` | string | noun, verb, … |
| `meaningVi` | string | Vietnamese gloss |
| `definition` | string | EN definition |
| `example` / `exampleVi` | string | Example sentence |
| `collocations` | string[] | Optional |
| `distractors` | string[] | Quiz wrong options (VI or EN per generator) |

## Lesson progress (UI mock)

| Metric | Rule |
|--------|------|
| **Hoạt động hiện tại** | Step-local counter (flash index, matches, quiz question, …). |
| **Tiến độ toàn bài / đã thành thạo** | +1 per **word** when user answers that word **correctly in quiz** (not flashcard “Đã nhớ” or matching). |
| **Bài hoàn thành** | User reaches `lessonComplete`. Stats on screen = **main quiz only** (`finalStats`), not ôn nhanh / quiz xác nhận. |
| **Từ yếu** | Flashcard “Học lại” / ghép thẻ sai → `flashcardReviewIds` + `weakWordIds`. Quiz chính sai (đã “Đã nhớ” flashcard) → chỉ `weakWordIds`. |
| **Ôn nhanh** | Một bước UI (`review`), **không xen kẽ**: **hết một lượt flashcard** (từ cần thẻ) → **một lượt quiz** (mọi từ trong queue, 1 câu/từ). Từ Học lại/carry/ghép sai có mặt ở cả hai lượt; từ chỉ sai quiz chính chỉ ở lượt quiz. Tiến độ **1/tổng → t/tổng**. Không cộng thống kê chính. |
| **Quiz xác nhận** | Một câu / từ trong ôn nhanh; đúng → bỏ khỏi `weakWordIds`; **không** cập nhật `finalStats`. |
| **Nhảy thẳng hoàn thành** | Quiz chính xong, không từ yếu và không carry → `lessonComplete` + thống kê. |
| **Carry sang bài sau** | `sessionStorage` key `dailytaka:vocab-weak:{nextLessonId}` — từ yếu bài này + từ bài trước chưa “Đã nhớ” ở ôn nhanh. |

### Future DB — queue từ yếu (ôn nhanh)

Mock hiện tại: `weakWordIds`, `flashcardReviewIds`, `sessionStorage` carry. Khi có DB, gom vào **một bảng queue** (xem `docs/database-design.md` → `user_vocabulary_weak_items`):

- Mỗi row = một từ sai/yếu của user trong ngữ cảnh một bài.
- Cột `review_flashcard_required` → có trong lượt flashcard ôn nhanh hay không.
- Lượt quiz ôn nhanh = mọi row `status = active` của bài (và carry từ bài trước).
- Thứ tự UI: flashcard queue → quiz queue (giống client).

Persist thêm `quiz_mastered` per user/lesson; bỏ sessionStorage carry.

## Quiz generation

Client/server helpers in `lib/learn/vocab/quiz/generate-vocab-quiz-questions.ts`:

- `meaningChoice` — term → pick `meaningVi`
- `listenChoice` — TTS term → pick English option
- `clozeChoice` — example blank → pick term
- `termFromMeaning` — pick English for Vietnamese prompt

Future DB: store `quiz_templates[]` per lesson or derive from `words` only.
