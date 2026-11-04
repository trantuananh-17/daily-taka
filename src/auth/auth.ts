/**
 * Better Auth (session, OAuth) — phase 2.
 * Admin routes today: `requireAdminAuth()` + ADMIN_API_KEY; replace with
 * `auth.api.getSession` + admin role when Drizzle auth schema is merged.
 * @see .cursor/skills/better-auth/SKILL.md
 */

export type AuthSession = {
  user: { id: string; email: string; name: string }
  session: { id: string; userId: string }
}
