# Admin data table (shadcn + TanStack Table)

## Dùng chung

| File | Vai trò |
|------|---------|
| `data-table.tsx` | Core table + state |
| `data-table-toolbar.tsx` | 2 ô lọc + Columns |
| `data-table-pagination.tsx` | limit 10/25/50 + Previous/Next |
| `admin-data-table-panel.tsx` | **Card + mô tả + DataTable** — import panel này từ feature |
| `admin-table-columns.tsx` | `adminTableSelectColumn()` |
| `data-table-column-header.tsx` | Sort header |

## Feature pattern

1. `*-table-columns.tsx` — `buildXColumns()` + export `X_TABLE_FILTER`
2. Page/panel — `<AdminDataTablePanel columns={...} data={...} filter={X_TABLE_FILTER} />`

Ví dụ: `features/topics/components/topics-table-columns.tsx`
