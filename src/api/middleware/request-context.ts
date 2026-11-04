import { randomUUID } from "node:crypto"
import type { MiddlewareHandler } from "hono"

import { logger } from "../../shared/logger"
import type { AppEnv } from "../types"

export const requestContext: MiddlewareHandler<AppEnv> = async (c, next) => {
  const requestId = c.req.header("x-request-id") ?? randomUUID()
  c.set("requestId", requestId)
  c.set("logger", logger.child({ requestId }))
  c.header("x-request-id", requestId)
  await next()
}
