import { createMiddleware } from "hono/factory"

import { env } from "../config/env"
import { AppError } from "../shared/errors"

/**
 * Protects `/v1/admin/*` until Better Auth admin roles ship.
 * Send `Authorization: Bearer <ADMIN_API_KEY>` or header `x-admin-api-key`.
 */
export function requireAdminAuth() {
  return createMiddleware(async (c, next) => {
    const configured = env.adminApiKey
    if (!configured) {
      throw new AppError(
        "ADMIN_AUTH_NOT_CONFIGURED",
        "Set ADMIN_API_KEY in the API environment to use admin routes.",
        503,
      )
    }

    const authorization = c.req.header("Authorization")
    const bearer =
      authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : null
    const headerKey = c.req.header("x-admin-api-key")?.trim() ?? null

    if (bearer !== configured && headerKey !== configured) {
      throw new AppError("UNAUTHORIZED", "Admin authentication required.", 401)
    }

    await next()
  })
}
