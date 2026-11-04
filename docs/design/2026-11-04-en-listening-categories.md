# Feature: Listening category catalog (`/:language/listen`)

## Goal

Trang chọn **chủ đề nghe chép chính tả** tiếng Anh: grid thẻ chủ đề (cover SVG, mô tả, trình độ, số bài). Dữ liệu từ API; hiện mock JSON trong frontend.

## User stories

- Là người học tiếng Anh, tôi muốn xem danh sách chủ đề nghe để chọn bài phù hợp trình độ.
- Là hệ thống, tôi muốn trả về danh sách category có `sort_order`, `levels`, `lessonCount` và metadata cover để UI render nhất quán.

## API / contracts

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/languages/:code/listening/categories` | `code` = `en` \| `zh` \| `jp` | `ListeningCategoryListResponse` |

### `ListeningCategoryListResponse`

| Field | Type | Notes |
|-------|------|--------|
| `next` | `string \| null` | Cursor pagination (null = hết) |
| `rows` | `ListeningCategory[]` | |
| `version` | `string` | Cache bust / ETag gợi ý |
| `complete` | `boolean` | Trang cuối |

### `ListeningCategory`

| Field | Type | DB gợi ý |
|-------|------|----------|
| `id` | string | PK, e.g. `category-en-short-stories` |
| `name` | string | Display EN |
| `slug` | string | Unique per language, URL segment |
| `levels` | string[] | CEFR codes; `[]` = mọi trình độ |
| `sort_order` | number | Thứ tự hiển thị |
| `description` | string \| null | Mô tả (API); có thể localize sau |
| `descriptionVi` | string (optional) | **Mock UI only** — bỏ khi có bảng i18n |
| `lessonCount` | number | Denormalized count hoặc aggregate |
| `cover.tone` | enum | `sage \| blue \| sand \| rose \| lavender` |
| `cover.artKey` | string | Key SVG trong app (`topic-cover-art.tsx`) |

**SVG:** Không lưu raw SVG trong DB — lưu `cover.artKey` (stable slug). Tone có thể override theo design system hoặc lưu cột `cover_tone`.

## Schema changes (draft)

- [ ] `listening_categories` — `id`, `language_code`, `slug`, `name`, `sort_order`, `description`, `cover_tone`, `cover_art_key`, `levels` (jsonb hoặc bảng n-n với `cefr_levels`)
- [ ] `listening_lessons` — FK `category_id` (cho `lessonCount`)
- [ ] Unique `(language_code, slug)`

## Mock payload

Mock theo ngôn ngữ: `mock/en-categories.json`, `mock/zh-categories.json`, `mock/jp-categories.json`. Loader: `getListeningCategories(language)`.

Mẫu đầy đủ (đã bổ sung `cover` + `descriptionVi` so với API gốc):

```json
{
  "next": null,
  "rows": [
    {
      "id": "category-en-short-stories",
      "name": "Short Stories",
      "slug": "short-stories",
      "levels": ["A1", "A2", "B1", "B2", "C1"],
      "sort_order": 1,
      "description": null,
      "descriptionVi": "Luyện nghe qua truyện ngắn, theo dõi nhân vật và diễn biến câu chuyện.",
      "lessonCount": 294,
      "cover": { "tone": "sage", "artKey": "short-stories" }
    }
  ],
  "version": "5208",
  "complete": true
}
```

Toàn bộ 14 category: xem file JSON mock (cùng thứ tự `sort_order` 1–14).

## UI

- Routes: `/en/listen`, `/zh/listen`, `/jp/listen` (cùng UI, khác JSON)
- Feature: `web/app/src/features/listen/` — `TopicsCatalog`, `TopicCard`, `TopicCoverArt`, `ListenCatalogPage`
- Breadcrumb: Daily Taka → Học tiếng Anh → Nghe chép chính tả
- Link chủ đề: `/{language}/{slug}` (placeholder lesson list)

## Edge cases

- `levels: []` → hiển thị **Mọi trình độ**
- `description` null → fallback `descriptionVi` (mock) rồi chuỗi rỗng
- `artKey` không map → fallback SVG Short Stories

## Test scenarios (TDD)

1. GET categories trả 14 rows, sorted by `sort_order`
2. Slug unique per language
3. `lessonCount` khớp aggregate lessons (khi có DB)

## Out of scope

- Trang danh sách bài trong từng slug (`/en/short-stories`)
- Nội dung category zh/jp thật (mock hiện clone id từ en)
- Auth / progress

## References

- `docs/database-design.md`
- `web/app/src/lib/learn/listening/`
