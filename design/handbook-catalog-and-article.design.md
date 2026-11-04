# Handbook (Cẩm nang) — catalog + article

Brand: **Daily Taka** (`brand-naming.mdc`). UI: shadcn + Animate UI.

Routes (EN first):

- Catalog: `/{lang}/handbook`
- Article: `/{lang}/handbook/{postSlug}`

Data: `HandbookCollection` / `HandbookPost` — `docs/design/2026-11-04-handbook-blog-content-json.md`, fixture `handbook-posts-en.sample.json`.

---

## Catalog page

### Breadcrumb

`Học tiếng Anh` (hub) → `Cẩm nang` (current, pill xanh nhạt).

### Collection header (blog index hero)

| Element | Source field | Style gợi ý |
|---------|--------------|-------------|
| Thanh accent dọc trái | *(layout)* | `border-l-4 border-emerald-600 pl-4` |
| Overline | `collection.overline` | uppercase, tracking, emerald-700, text-xs/sm |
| H1 | `collection.title` | serif/display, `text-3xl`+ |
| Mô tả | `collection.description` | `text-muted`, max-width prose |
| Số bài | `posts.length` | `9 bài viết` — grey small |

### Danh sách bài (grid)

- **Bài featured** (`post.featured === true`): một card **full width** (`col-span-full`), số `01` lớn hơn hoặc cùng style.
- **Các bài còn lại:** grid **3 cột** từ `md` (`grid-cols-1 md:grid-cols-3`), gap đồng bộ curriculum lesson cards.

### Card anatomy

```
┌─────────────────────────────────────────┐
│ 01   CATEGORY · N PHÚT ĐỌC              │
│ Title (bold, 2 lines clamp)             │
│ Excerpt (muted, line-clamp-3)           │
│ Đọc cẩm nang →                          │
└─────────────────────────────────────────┘
```

| Card field | JSON |
|------------|------|
| Index | `String(sortOrder).padStart(2,'0')` |
| Meta line | `{category} · {readingTimeMinutes} PHÚT ĐỌC` |
| Title | `title` |
| Teaser | `excerpt` |
| Link | `/{lang}/handbook/{slug}` |
| CTA | copy cố định **Đọc cẩm nang** |

Card: white bg, rounded-xl, border hairline, hover shadow nhẹ.

---

## Article page

### Article header (hero)

| Element | Source | Style |
|---------|--------|--------|
| Category kicker | `post.category` | uppercase emerald, small |
| H1 | `post.title` | large bold |
| Lead | `post.summary` | muted paragraph under title |
| Meta | derived | Clock + `{readingTimeMinutes} phút đọc` · Calendar + `Xuất bản {publishedAt}` (format VI) |
| Divider | — | `border-b` full width |

Không hiển thị `excerpt` trên detail (chỉ catalog); dùng `summary`.

### Body — render `blocks[]` theo thứ tự

Mỗi block = ** một section** (vertical stack, `gap-8`).

#### `kind: "text"`

- **H2:** `block.heading`
- **Paragraphs:** map `block.paragraphs[]` → `<p className="font-body leading-relaxed">`

#### `kind: "numberedList"`

- **H2:** `block.heading`
- Optional **intro** paragraph trước list
- **List:** `<ol>` — số trong badge tròn xanh nhạt (Animate UI / custom), text item

### Footer (optional phase 2)

Link bài trước / sau theo `sortOrder` trong cùng collection.

---

## API / loader (mock)

```typescript
getHandbookCollection(language, slug) → HandbookCollection
getHandbookPost(language, collectionSlug, postSlug) → HandbookPost | null
```

Catalog: map `posts` → featured + grid.  
Detail: `notFound()` nếu slug không thuộc collection.

---

## DB (tóm tắt)

- `handbook_collections`: header fields
- `handbook_posts`: meta + `summary` + `featured`
- `handbook_post_blocks`: `post_id`, `sort_order`, `kind`, `payload jsonb` — hoặc `body jsonb` một cột

Chi tiết: `2026-11-04-handbook-blog-content-json.md`.
