# Kiến trúc ứng dụng

## Monorepo (fullstack)

| Package | Path | Vai trò |
|---------|------|---------|
| `@dailytaka/backend` | repo root `src/` | Hono API, auth, DB, media storage |
| `@dailytaka/web` | `web/app/` | Next.js learner |
| `@dailytaka/admin-web` | `web/admin/` | Admin CMS (placeholder) |

Chi tiết cây thư mục: [repo-structure.md](./repo-structure.md)

## Stack

- **API:** Hono + `@hono/node-server` (pattern Ragenta)
- **Frontend:** Next.js App Router, shadcn/ui, Animate UI
- **Auth:** Better Auth
- **DB:** PostgreSQL + Drizzle
- **Media:** S3-compatible (MinIO/R2) — [media-storage.md](./media-storage.md)

## Layer backend (DI)

```
src/modules/<feature>/
  *.routes.ts → *.service.ts → *.repository.ts → db
```

- Env: `src/config/env.ts` only
- Use cases throw `shared/errors`; `api/middleware/error-handler` maps to HTTP

## Web

```
web/app/src/
  app/           # routes (thin pages)
  components/ui/ # shadcn
  components/layout/
  features/      # dictation, vocabulary, writing
  lib/           # api client, auth
```

## Test

- Backend: Vitest `src/**/*.test.ts`
- UI: sau khi có `design/*.design.md`

DB schema: [database-design.md](./database-design.md)
