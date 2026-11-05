import { createMiddleware } from "hono/factory"

import { AppError } from "../shared/errors"
import { auth } from "./create-auth"

export function requireUserAuth() {
  return createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session?.user?.id) {
      throw new AppError("UNAUTHORIZED", "Sign in required.", 401)
    }
    c.set("userId", session.user.id)
    await next()
  })
}

export async function getOptionalUserId(headers: Headers): Promise<string | undefined> {
  const session = await auth.api.getSession({ headers })
  return session?.user?.id
}
