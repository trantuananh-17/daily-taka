import { Hono } from "hono"
import { cors } from "hono/cors"

import { env } from "../config/env"
import { checkDatabaseConnection } from "../db/client"
import { isStorageConfigured } from "../storage/objects"
import { errorHandler } from "./middleware/error-handler"
import { requestContext } from "./middleware/request-context"
import type { AppEnv } from "./types"

const DEFAULT_ORIGINS = ["http://localhost:*", "https://localhost:*"]

function wildcardToRegex(pattern: string) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`^${escaped.replace(/\*/g, "[^/]*")}$`)
}

const ALLOWED_ORIGINS = [...new Set([...DEFAULT_ORIGINS, ...env.trustedOrigins])].map(
  wildcardToRegex,
)

export function createApp() {
  const app = new Hono<AppEnv>()

  app.onError(errorHandler)
  app.use("*", requestContext)
  app.use(
    "*",
    cors({
      origin: (origin) =>
        ALLOWED_ORIGINS.some((pattern) => pattern.test(origin)) ? origin : null,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "x-request-id"],
      credentials: true,
    }),
  )

  app.get("/health", async (c) => {
    const database = await checkDatabaseConnection()
    const storage = isStorageConfigured()
    const ok = database.ok
    return c.json(
      {
        status: ok ? "ok" : "degraded",
        checks: { database, storage: { configured: storage } },
      },
      ok ? 200 : 503,
    )
  })

  app.get("/", (c) => c.json({ name: "dailytaka-api", version: "0.1.0" }))

  // Module routes mount here — e.g. app.route("/v1/dictation", dictationRoutes)

  return app
}
