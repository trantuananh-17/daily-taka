import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { requireUserAuth } from "../../auth/require-user-auth"
import { patchUserSettingsBodySchema } from "./user-settings.dto"
import { UserSettingsRepository } from "./user-settings.repository"
import { UserSettingsService } from "./user-settings.service"

function createService() {
  return new UserSettingsService(new UserSettingsRepository(db))
}

export function createUserSettingsRoutes() {
  const app = new Hono<AppEnv>()

  app.use("*", requireUserAuth())

  app.get("/", async (c) => {
    const userId = c.get("userId")!
    const service = createService()
    const settings = await service.getSettings(userId)
    return c.json({ preferences: settings })
  })

  app.patch("/", async (c) => {
    const userId = c.get("userId")!
    const body = patchUserSettingsBodySchema.parse(await c.req.json())
    const service = createService()
    const settings = await service.patchSettings(userId, body)
    return c.json({ preferences: settings })
  })

  return app
}
