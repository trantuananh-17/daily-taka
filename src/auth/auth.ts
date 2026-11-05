/**
 * @see .cursor/skills/better-auth/SKILL.md
 */
export { auth } from "./create-auth"

export type AuthSession = {
  user: { id: string; email: string; name: string }
  session: { id: string; userId: string }
}
