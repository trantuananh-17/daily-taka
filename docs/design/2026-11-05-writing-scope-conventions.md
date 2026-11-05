# Writing — quy ước phạm vi

**Cập nhật:** 2026-11-05

## Phạm vi MVP (EN)

- DB + API public `/v1/languages/en/writing/...`
- User progress + guest merge `/v1/user/writing/...`
- **Learner UI** (`web/app`) nối API + player progress; SSR cookie resume + PUT debounce 700ms.
- Seed: EN A1 · Daily Life · Bài 01 (`pnpm db:seed:writing`).

## Admin

- **Chỉ endpoint** (`/v1/admin/languages/:languageCode/writing`) — GET tree, GET lesson, PUT sentences.
- **Không** `web/admin` CMS cho đến khi user yêu cầu *code admin UI*.

## ZH / JP

- Player mock local vẫn hoạt động; **không** seed DB / merge server cho zh/jp trong phase này.

Backlog: `docs/design/2026-11-05-writing-post-mvp-backlog.md` (tạo khi cần).
