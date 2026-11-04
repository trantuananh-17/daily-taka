import { Hono } from "hono"
import { cors } from "hono/cors"

import { env } from "../config/env"
import { checkDatabaseConnection } from "../db/client"
import { isStorageConfigured } from "../storage/objects"
import { errorHandler } from "./middleware/error-handler"
import { requestContext } from "./middleware/request-context"
import { requireAdminAuth } from "../auth/require-admin-auth"
import { createListeningAdminRoutes } from "../modules/listening/listening.admin.routes"
import { createListeningAudioRoutes } from "../modules/listening/listening.audio.routes"
import { createListeningRoutes } from "../modules/listening/listening.routes"
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
      allowHeaders: ["Content-Type", "Authorization", "x-request-id", "Range"],
      exposeHeaders: ["Content-Length", "Content-Range", "Accept-Ranges"],
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

  app.route("/v1/languages/:languageCode/listening", createListeningRoutes())
  app.route("/v1/languages/:languageCode/listening", createListeningAudioRoutes())
  app.use("/v1/admin/*", requireAdminAuth())
  app.route("/v1/admin/languages/:languageCode/listening", createListeningAdminRoutes())

  return app
}
