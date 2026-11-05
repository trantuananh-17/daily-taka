# Admin Listen CMS — mock UI (phase 1)

**Phạm vi:** `web/admin` — mock only, **không** gọi API cho đến khi user yêu cầu.

## Sidebar

- **Topic** → `/topics` (Data Table shadcn + TanStack Table)
- **Listen** → `/listen` (Level / Chương / Bài — mock)

## Trang `/topics`

```
Header (một danh sách topic **dùng chung**, không lọc EN/ZH/JP)
→ Data table: cột **Tên · Slug · Trạng thái** (+ chọn dòng, ⋯)
→ Lọc tên / slug · Columns · pagination + **limit 10 | 25 | 50** (query API)
→ Dialog: name, slug, isPublished
```

**Không** chart.

## Bảng chủ đề

| Cột | Nguồn |
|-----|--------|
| Tên | `name` |
| Slug | `slug` |
| Level | `levels[]` → hiển thị dải `A1–C1` |
| Chương | `sectionCount` (mock; BE aggregate sau) |
| Bài | `lessonCount` |
| Trạng thái | `isPublished` |

## Dialog thêm chủ đề

Body khớp `createCategoryBodySchema` — `POST /v1/admin/languages/:lang/listening/categories`:

- `name`, `slug` (bắt buộc)
- `descriptionVi`, `sortOrder`, `levels[]`, `isPublished`

Submit mock: append vào state local.

## File map

- `features/listen/lib/listen-cms-mock.ts`
- `features/listen/lib/format-level-range.ts`
- `features/listen/components/listen-topic-list.tsx`
- `features/listen/components/listen-create-topic-dialog.tsx`
