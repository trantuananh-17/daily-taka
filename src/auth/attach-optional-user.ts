import { createMiddleware } from "hono/factory"

import { getOptionalUserId } from "./require-user-auth"

export function attachOptionalUser() {
  return createMiddleware(async (c, next) => {
    const userId = await getOptionalUserId(c.req.raw.headers)
    if (userId) c.set("userId", userId)
    await next()
  })
}
