import type { ErrorHandler } from "hono"
import { HTTPException } from "hono/http-exception"
import { ZodError } from "zod"

import { isAppError } from "../../shared/errors"
import { logger } from "../../shared/logger"
import type { AppEnv } from "../types"

interface ErrorBody {
  error: { code: string; message: string; details?: unknown }
  requestId: string
}

export const errorHandler: ErrorHandler<AppEnv> = (error, c) => {
  const requestId = c.get("requestId") ?? "unknown"
  const log = c.get("logger") ?? logger

  if (isAppError(error)) {
    log.warn("request.failed", { code: error.code, status: error.status })
    return c.json<ErrorBody>(
      {
        error: { code: error.code, message: error.message, details: error.details },
        requestId,
      },
      error.status,
    )
  }

  if (error instanceof HTTPException) {
    return error.getResponse()
  }

  if (error instanceof ZodError) {
    return c.json<ErrorBody>(
      {
        error: { code: "VALIDATION_ERROR", message: "Invalid request.", details: error.flatten() },
        requestId,
      },
      400,
    )
  }

  log.error("request.unhandled", { err: String(error) })
  return c.json<ErrorBody>(
    { error: { code: "INTERNAL_ERROR", message: "Something went wrong." }, requestId },
    500,
  )
}
