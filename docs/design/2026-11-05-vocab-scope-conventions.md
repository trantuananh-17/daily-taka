# Vocab — quy ước phạm vi (tránh hỏi lại)

**Cập nhật:** 2026-11-05

## Admin

- **Chỉ API / endpoint** (`/v1/admin/languages/:languageCode/vocab`, …) cho đến khi user **yêu cầu rõ** *code admin UI*.
- **Không** tự làm `web/admin/` hoặc màn CMS vocab trên Next admin.

## Ngôn ngữ content (CN / JP)

- **Chưa làm** curriculum vocab ZH/JP trên DB, merge guest, progress server cho zh/jp.
- Route FE `zh/vocab`, `jp/vocab` giữ seed/mock local như hiện tại.
- Progress + weak merge + hub API counts: **EN first** (`language === "en"` + bài có `lessonDbId` từ API).

## Audio từ

- **Không** thêm cột audio / object storage cho vocab trong giai đoạn này.
- Phát âm: **TTS trình duyệt** (`speak-vocab-term.ts` / Web Speech).

## Đã ship (EN MVP)

- `user_vocab_lesson_progress` + user API progress/complete.
- Hub: `completedCount` topic (logged-in qua API level + guest localStorage).
- Guest merge: `POST /v1/user/vocab/guest-data/merge` + `mergeGuestVocabIfNeeded` on login.
- Weak: sync, carry, `clear-word` khi quiz đúng / mastered.
- SSR resume: `serverFetchJson` forward cookie → `lessonProgress` + `resolveInitialVocabStep`; PUT debounce 700ms.

Backlog còn lại: `docs/design/2026-11-05-vocab-post-mvp-backlog.md`.
