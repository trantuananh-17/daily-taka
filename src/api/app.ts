import { Hono } from "hono"
import { cors } from "hono/cors"

import { env } from "../config/env"
import { checkDatabaseConnection } from "../db/client"
import { isStorageConfigured } from "../storage/objects"
import { errorHandler } from "./middleware/error-handler"
import { requestContext } from "./middleware/request-context"
import { auth } from "../auth/create-auth"
import { requireAdminAuth } from "../auth/require-admin-auth"
import { createListeningAdminRoutes } from "../modules/listening/listening.admin.routes"
import { createListeningUserRoutes } from "../modules/listening/listening-user.routes"
import { createUserSettingsRoutes } from "../modules/user-settings/user-settings.routes"
import { createListeningAudioRoutes } from "../modules/listening/listening.audio.routes"
import { createListeningRoutes } from "../modules/listening/listening.routes"
import { createVocabAdminRoutes } from "../modules/vocab/vocab.admin.routes"
import { createVocabRoutes } from "../modules/vocab/vocab.routes"
import { createVocabUserRoutes } from "../modules/vocab/vocab-user.routes"
import { createAdminDashboardRoutes } from "../modules/admin-dashboard/admin-dashboard.routes"
import { createWritingAdminRoutes } from "../modules/writing/writing.admin.routes"
import { createWritingRoutes } from "../modules/writing/writing.routes"
import { createWritingUserRoutes } from "../modules/writing/writing-user.routes"
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
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "x-admin-api-key",
        "x-request-id",
        "Range",
        "Cookie",
      ],
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

  app.all("/api/auth/*", (c) => auth.handler(c.req.raw))

  app.route("/v1/user/listening", createListeningUserRoutes())
  app.route("/v1/user/vocab", createVocabUserRoutes())
  app.route("/v1/user/writing", createWritingUserRoutes())
  app.route("/v1/user/settings", createUserSettingsRoutes())

  app.route("/v1/languages/:languageCode/listening", createListeningRoutes())
  app.route("/v1/languages/:languageCode/listening", createListeningAudioRoutes())
  app.use("/v1/admin/*", requireAdminAuth())
  app.route("/v1/admin/dashboard", createAdminDashboardRoutes())
  app.route("/v1/admin/languages/:languageCode/listening", createListeningAdminRoutes())
  app.route("/v1/admin/languages/:languageCode/vocab", createVocabAdminRoutes())
  app.route("/v1/admin/languages/:languageCode/writing", createWritingAdminRoutes())
  app.route("/v1/languages/:languageCode/vocab", createVocabRoutes())
  app.route("/v1/languages/:languageCode/writing", createWritingRoutes())

  return app
}
