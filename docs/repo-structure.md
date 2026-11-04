# Monorepo structure (Ragenta-inspired)

```
dailytaka/                    # @dailytaka/backend — Hono API at repo root
├── src/
│   ├── main.api.ts           # API process entry
│   ├── main.worker.ts        # Worker entry (queues — later)
│   ├── api/                  # Hono app, middleware, OpenAPI (later)
│   ├── auth/                 # Better Auth
│   ├── config/               # env (single source)
│   ├── db/                   # Drizzle client, schema, migrate
│   ├── modules/              # Feature modules (routes/service/repo)
│   ├── storage/              # S3-compatible media (MinIO/R2)
│   ├── shared/               # errors, logger
│   ├── redis/                # reserved
│   ├── queue/                # reserved
│   ├── jobs/                 # reserved
│   └── workers/              # reserved
├── drizzle/                  # SQL migrations
├── scripts/
├── web/
│   ├── app/                  # @dailytaka/web — learner Next.js
│   └── admin/                # @dailytaka/admin-web — CMS (later)
├── design/                   # *.design.md per page
└── docs/
```

## Scripts (root)

| Command | Mô tả |
|---------|--------|
| `pnpm dev:api` | Hono API `:8080` |
| `pnpm dev:web` | Next learner app |
| `pnpm test` | Vitest (backend) |

## Web app layout (target, like Ragenta frontend)

```
web/app/src/
  app/              # routes
  components/       # ui (shadcn), layout
  features/         # dictation, vocabulary, …
  lib/              # api client, auth client
```

Media: [media-storage.md](./media-storage.md)
