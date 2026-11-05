# Daily Taka Admin (`web/admin`)

Next.js CMS mock — port **3001**, theme & shadcn components đồng bộ `web/app`.

**Màu / token:** `src/app/globals.css` + `dlx-components.css` copy từ `web/app/src/app/` (cùng `--dlx-*`, shadcn `--primary`, `--sidebar-*`).

**UI rule:** `.cursor/rules/admin-ui-implementation.mdc` — stat/chart/bảng qua shadcn (`chart`, `table`, `Card`), không tự thiết kế block.

## Chạy dev

```bash
# Từ repo root (cần ADMIN_API_KEY trong .env)
pnpm install
pnpm dev:admin
```

Mở http://localhost:3001/login — nhập cùng giá trị `ADMIN_API_KEY` như Hono admin API.

## Env

| Biến | Ghi chú |
|------|---------|
| `ADMIN_API_KEY` | Server-only — đăng nhập admin + header `x-admin-api-key` |
| `NEXT_PUBLIC_API_URL` | API learner/admin fetch (mặc định `http://localhost:8080`) |

**Bắt buộc:** đặt `ADMIN_API_KEY` trong **`web/admin/.env.local`** (copy từ `web/admin/.env.example`). Next **không** đọc `.env` repo root cho app admin.

## Cấu trúc

- Layout: **shadcn block `sidebar-07`** (`SidebarProvider` + `AppSidebar` + `SidebarInset`)
- `(dashboard)/` — `/` dashboard stub; các route còn lại **Coming soon**

Chi tiết API: `docs/design/2026-11-05-admin-ui-prep.md`.
