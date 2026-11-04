# Daily Lexis (dailytaka)

Monorepo fullstack — Hono API (root) + Next.js web.

## Structure

```
dailytaka/          → @dailytaka/backend (Hono, Ragenta-style src/)
web/app/            → @dailytaka/web
web/admin/          → @dailytaka/admin-web (later)
```

See [docs/repo-structure.md](./docs/repo-structure.md).

## Quick start

```bash
cp .env.example .env   # set BETTER_AUTH_SECRET, DATABASE_URL
pnpm install
pnpm dev:api             # :8080
pnpm dev:web             # :3000
pnpm test
```

## Docs

| File | Nội dung |
|------|----------|
| [docs/database-design.md](./docs/database-design.md) | PostgreSQL schema |
| [docs/media-storage.md](./docs/media-storage.md) | Audio / images → object storage |
| [docs/architecture.md](./docs/architecture.md) | Packages & layers |
| [design/README.md](./design/README.md) | `*.design.md` per page |

## Cursor

- [AGENTS.md](./AGENTS.md) + [.cursorrules](./.cursorrules) — backend / frontend / UI agents
- `.cursor/rules/` — TDD, DI, scope, `ui-implementation.mdc`
- `.cursor/skills/lean-context/` — giảm đọc file, tiết kiệm credit
