# Phân tích UI mockup → product & data

Tham chiếu ảnh Daily Lexis bạn gửi. Chi tiết bảng: [database-design.md](./database-design.md).

## Ảnh 1 & 10 — Landing

- **Chức năng:** chọn ngôn ngữ học EN / ZH / JP; slogan NGHE · HỌC · TIẾN BỘ.
- **Data:** `languages`; CTA dẫn hub theo `language.slug`.
- **Nav:** Khám phá, Bảng xếp hạng, thông báo (badge), Đăng nhập, cài đặt.

## Ảnh 2 & 6 — Hub “Học tiếng Anh”

- **3 module:** Nghe chép chính tả · Học từ vựng · Học viết.
- **Data:** `skills` + `language_skills`; breadcrumb `language > hub`.

## Ảnh 5 — Dictation: danh mục collection

- **Card:** Short Stories, Conversations, TOEIC, IELTS, TOEFL, Kid Stories, NEWS…
- **Metadata card:** khoảng CEFR (A1–C1), số bài (294, 600…).
- **Data:** `dictation_collections`.

## Ảnh 3 & 8 — Short Stories: sections

- **Filter:** tìm tên bài, lọc trình độ; “17 phần”.
- **Section accordion:** Section N, progress `0/15`, expand → grid bài.
- **Lesson card:** số thứ tự, title, `N câu`, CEFR, sao (optional rating/difficulty).
- **Data:** `dictation_sections`, `dictation_lessons`, `user_dictation_lesson_progress`.

## Ảnh 4 — Player dictation (First Snow Fall)

- **21 câu;** mode Nghe và chép / Toàn bộ transcript; tốc độ phát; hotkeys.
- **Câu:** audio, textarea, gợi ý tên riêng (November).
- **Data:** `dictation_sentences`, attempts/progress per sentence.

## Ảnh 7 — Vocabulary: chọn CEFR

- **Grid A1–C2;** breadcrumb Học từ vựng.
- **Data:** `vocabulary_curricula` keyed by level.

## Ảnh 12 & 13 — Vocabulary: topics & lessons

- **Topic row:** Everyday Communication, 10 bài, progress `0/10`.
- **Lesson card:** title, `10 từ · A1`.
- **Data:** `vocabulary_topics`, `vocabulary_lessons`.

## Ảnh 9 — Preview batch từ

- **10 từ** EN ↔ VI, nút phát audio, CTA flashcard.
- **Data:** `vocabulary_batches`, `vocabulary_items`.

## Ảnh 11 — Lesson overview (Immediate Family…)

- **Meta:** 10 từ, 1 batch, ~5 phút; timeline 5 bước (làm quen → flashcard → ghép → quiz → ôn).
- **Progress:** `0/10 đã thành thạo`.
- **Data:** `vocabulary_lesson_activities`, `user_vocabulary_item_states` (SRS/mastery).

## Ảnh 14 — Writing (Cooking Breakfast)

- **Dark fullscreen;** câu 1/12; prompt VI → đáp án EN; mask độ dài từ.
- **Breadcrumb:** Học viết > A1 > Daily Life > Cooking Breakfast.
- **Data:** `writing_topics`, `writing_lessons`, `writing_prompts.word_lengths`.

## Cross-cutting (mọi màn)

| Tính năng | Gợi ý lưu trữ |
|-----------|----------------|
| Auth | Better Auth tables + `user_profiles` |
| Leaderboard | `user_stats.total_xp` + snapshot/view |
| Notifications | `notifications` + `read_at` |
| Lộ trình / Kiến thức / Cẩm nang | Phase 2 — `content_pages` hoặc CMS |
| UI locale VI | `user_profiles.ui_locale` (copy UI), tách khỏi ngôn ngữ học |
