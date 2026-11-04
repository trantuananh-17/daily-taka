---
name: better-auth-dailytaka
description: Cấu hình Better Auth với Hono và Next.js cho Daily Lexis (Drizzle + PostgreSQL). Dùng khi setup auth, session, middleware, protected routes, hoặc user hỏi Better Auth trong repo này.
---

# Better Auth — Daily Lexis

## Stack pairing

- **DB:** PostgreSQL
- **ORM:** Drizzle (`better-auth` adapter `drizzleAdapter`)
- **Next.js:** route handler `/api/auth/[...all]` mount `auth.handler`
- **Hono:** sub-app hoặc middleware đọc session từ cùng `auth` instance

## Setup checklist

1. Env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (public URL app), `DATABASE_URL`
2. Schema: generate Better Auth tables + merge với `user_profiles` (1:1 `user.id`)
3. Single `auth` export từ `packages/auth` — web và api **import cùng instance**
4. Session trong Hono: `auth.api.getSession({ headers })` hoặc helper middleware
5. Không duplicate logic password/OAuth ngoài Better Auth config

## File layout (target)

```
packages/auth/
  src/auth.ts          # betterAuth({ database, plugins, ... })
  src/client.ts        # createAuthClient for Next (nếu cần)
packages/db/
  src/schema/auth.ts   # generated + custom profile
web/app/src/app/api/auth/[...all]/route.ts
```

## Plugins (gợi ý theo UI)

- Email/password hoặc OAuth (Google) — bật khi product yêu cầu
- `admin` — chỉ khi có CMS nội bộ
- Custom fields → `user_profiles` table Drizzle, không hack JSON vào user nếu query/filter cần

## Security

- Cookie `secure` production; sameSite lax/default
- Rate limit login (Hono middleware / Redis) — phase sau
- Không log session token

## TDD

- Test protected route: mock `getSession` trả user/null
- Integration: sign-up flow với test DB (tuỳ env CI)

## Docs

- https://www.better-auth.com/docs
- Schema app: `docs/database-design.md` (user_profiles, notifications)
