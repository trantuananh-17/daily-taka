# Admin UI — chuẩn bị code (vocab + writing)

**Khi user yêu cầu *code admin UI*** — scaffold `web/admin/` theo checklist này. API đã sẵn; learner app **không** dùng admin key.

## 1. Khởi tạo app

```bash
cd web/admin
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

- Port dev: **3001** (`package.json` script `dev -p 3001`).
- Monorepo: `pnpm --filter @dailytaka/admin-web dev`.

## 2. Env

| Biến | Mục đích |
|------|----------|
| `NEXT_PUBLIC_API_URL` | Hono API (mặc định `http://localhost:8080`) |
| `ADMIN_API_KEY` | **Server only** — header `x-admin-api-key` cho `/v1/admin/*` |

`.env.example` ở root đã có `ADMIN_API_KEY`; admin app đọc cùng key qua server actions / route handlers — **không** expose ra client bundle.

## 3. API đã có (endpoint-only)

| Skill | Base admin |
|-------|------------|
| Vocab | `GET/PATCH /v1/admin/languages/:lang/vocab/:levelCode`, `GET/PATCH /lessons/:id`, `PUT /lessons/:id/words` |
| Writing | `GET /:levelCode`, `GET /lessons/:id`, `PUT /lessons/:id/sentences` |
| Listen | `/v1/admin/languages/:lang/listening/*` (categories, sections, lessons, sentences) |

Auth: middleware `requireAdminAuth()` — so khớp `ADMIN_API_KEY`.

## 4. Trang UI gợi ý (MVP CMS)

1. **Dashboard** — link EN vocab A1 / writing A1 / listen categories.
2. **Vocab level tree** — topics + lessons; click lesson → editor words (JSON table hoặc form từng từ).
3. **Writing level tree** — click lesson → editor sentences (prompt VI, target, pronunciation jsonb).
4. **Listen** — reuse pattern listening admin (category → section → lesson → sentences).

Stack UI: shadcn (copy từ `web/app` hoặc init riêng), không bắt buộc Animate UI.

## 5. Data fetching pattern admin

```typescript
// Server action or Route Handler only
await fetch(`${API}/v1/admin/languages/en/vocab/A1`, {
  headers: { "x-admin-api-key": process.env.ADMIN_API_KEY! },
  cache: "no-store",
})
```

Không Better Auth cho admin MVP — key-based như curl hiện tại.

## 6. Learner app (đã nối)

- SSR: `serverFetchJson` forward cookie → resume progress vocab/writing + hub counts.
- Client: `credentials: "include"` qua `listeningFetchInit`.
- Progress PUT debounce **700ms** (vocab + writing).

## 7. Out of scope admin v1

- Upload media / R2
- ZH/JP vocab-writing CMS (chưa seed DB)
- Role RBAC / multi-admin user

Quy ước phạm vi learner: `vocab-scope-conventions.md`, `writing-scope-conventions.md`.
