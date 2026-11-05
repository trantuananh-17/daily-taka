import { cookies } from "next/headers"

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants"

export async function isAdminSessionValid(): Promise<boolean> {
  const store = await cookies()
  return store.get(ADMIN_SESSION_COOKIE)?.value === "1"
}

export function adminSessionCookieOptions(maxAgeSeconds = 60 * 60 * 12) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  }
}
