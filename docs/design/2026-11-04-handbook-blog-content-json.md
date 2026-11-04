# Cẩm nang (handbook / blog) — content JSON (mock → DB)

Payload + **UI mapping** (catalog header, cards, article sections). UI spec: `design/handbook-catalog-and-article.design.md`.

- Fixture: `docs/design/fixtures/handbook-posts-en.sample.json`
- FE mirror: `web/app/src/lib/learn/handbook/mock/handbook-posts-en.sample.json`
- Types: `web/app/src/lib/learn/handbook/types/content.ts`

Brand: **Daily Taka** (không Lexis trên UI).

---

## Document root

| Field | Type | Notes |
|-------|------|--------|
| `collections` | `HandbookCollection[]` | Một handbook / ngôn ngữ |

---

## Collection — catalog header

Dùng cho **phần header blog** (overline + H1 + mô tả + đếm bài).

| Field | Type | UI |
|-------|------|-----|
| `language` | `en` \| `zh` \| `jp` | Hub |
| `slug` | string | `/en/handbook` |
| `overline` | string | `CẨM NANG DAILY TAKA` — trên H1 |
| `title` | string | H1 catalog |
| `description` | string | Đoạn giới thiệu dưới H1 |
| `posts` | `HandbookPost[]` | `posts.length` → **N bài viết** |

Layout: accent bar trái + stack text (design doc).

---

## Post — catalog card

| Field | Type | Card UI |
|-------|------|---------|
| `slug` | string | href |
| `sortOrder` | number | `01`, `02`, … |
| `category` | string | Meta: `{category} · {readingTimeMinutes} PHÚT ĐỌC` |
| `readingTimeMinutes` | number | |
| `title` | string | Bold title |
| `excerpt` | string | Teaser (không dùng trên trang chi tiết) |
| `publishedAt` | string | ISO `YYYY-MM-DD` — chỉ detail meta |
| `featured` | boolean? | `true` → card full width hàng đầu |

Grid: featured full width; còn lại **3 cột** (`md:grid-cols-3`).

---

## Post — article header (detail)

| Field | Detail UI |
|-------|-----------|
| `category` | Kicker xanh, uppercase |
| `title` | H1 |
| `summary` | Lead paragraph (thay excerpt) |
| `readingTimeMinutes` + `publishedAt` | Hàng meta icon |

Sau header: **divider**, rồi render `blocks[]` = các **section** nối tiếp.

---

## Blocks (= sections nội dung)

| `kind` | Render |
|--------|--------|
| `text` | H2 `heading` + `paragraphs[]` |
| `numberedList` | H2 + optional `intro` + ordered list (badge số) |

Thứ tự mảng = thứ tự scroll trên trang.

Future: `quote`, `image`, `callout`.

---

## View-model (FE helpers)

```typescript
function splitCatalogPosts(posts: HandbookPost[]) {
  const sorted = [...posts].sort((a, b) => a.sortOrder - b.sortOrder)
  const featured = sorted.find((p) => p.featured) ?? sorted[0]
  const grid = sorted.filter((p) => p.slug !== featured?.slug)
  return { featured, grid, articleCount: sorted.length }
}
```

```typescript
function formatHandbookPublishedAt(iso: string, locale = "vi-VN") {
  // 2026-08-27 → "Xuất bản 27 thg 8, 2026"
}
```

---

## DB mapping

| Table | Nội dung |
|-------|----------|
| `handbook_collections` | `language_id`, `slug`, `overline`, `title`, `description`, `is_published` |
| `handbook_posts` | meta card + `summary`, `featured`, `excerpt`, `published_at` |
| `handbook_post_blocks` | `post_id`, `sort_order`, `kind`, `payload jsonb` |

**MVP:** `handbook_posts.body jsonb` = `{ blocks: HandbookBlock[] }` — không cần bảng blocks riêng.

Unique: `(collection_id, slug)`.

**Analytics (later):** `user_handbook_post_views`.

---

## Hub link

`language-hub-toolbar` → `/{lang}/handbook`.

---

## Validate

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/design/fixtures/handbook-posts-en.sample.json','utf8')); console.log('ok')"
```
