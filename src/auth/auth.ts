/**
 * Better Auth instance — wire drizzleAdapter + plugins when schema is generated.
 * @see .cursor/skills/better-auth/SKILL.md
 */

export type AuthSession = {
  user: { id: string; email: string; name: string }
  session: { id: string; userId: string }
}
