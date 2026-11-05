import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { requireUserAuth } from "../../auth/require-user-auth"
import {
  guestProgressMergeBodySchema,
  patchListenStarBodySchema,
  upsertListenProgressBodySchema,
} from "./listening-progress.dto"
import { ListeningProgressRepository } from "./listening-progress.repository"
import { ListeningProgressService } from "./listening-progress.service"
import { ListeningAdminRepository } from "./listening.admin.repository"
import { UserSettingsRepository } from "../user-settings/user-settings.repository"
import { UserSettingsService } from "../user-settings/user-settings.service"

function createProgressService() {
  return new ListeningProgressService(
    new ListeningProgressRepository(db),
    new ListeningAdminRepository(db),
    new UserSettingsService(new UserSettingsRepository(db)),
  )
}

export function createListeningUserRoutes() {
  const app = new Hono<AppEnv>()

  app.use("*", requireUserAuth())

  app.get("/lessons/:lessonId/progress", async (c) => {
    const userId = c.get("userId")!
    const service = createProgressService()
    const progress = await service.getProgress(userId, c.req.param("lessonId"))
    return c.json({ progress })
  })

  app.put("/lessons/:lessonId/progress", async (c) => {
    const userId = c.get("userId")!
    const body = upsertListenProgressBodySchema.parse(await c.req.json())
    const service = createProgressService()
    const progress = await service.upsertProgress(userId, c.req.param("lessonId"), body)
    return c.json({ progress })
  })

  app.post("/lessons/:lessonId/complete", async (c) => {
    const userId = c.get("userId")!
    const service = createProgressService()
    const progress = await service.completeLesson(userId, c.req.param("lessonId"))
    return c.json({ progress })
  })

  app.post("/lessons/:lessonId/restart", async (c) => {
    const userId = c.get("userId")!
    const service = createProgressService()
    const progress = await service.restartLesson(userId, c.req.param("lessonId"))
    return c.json({ progress })
  })

  app.patch("/lessons/:lessonId/star", async (c) => {
    const userId = c.get("userId")!
    const body = patchListenStarBodySchema.parse(await c.req.json())
    const service = createProgressService()
    const progress = await service.patchStar(userId, c.req.param("lessonId"), body)
    return c.json({ progress })
  })

  app.post("/guest-progress/merge", async (c) => {
    const userId = c.get("userId")!
    const body = guestProgressMergeBodySchema.parse(await c.req.json())
    const service = createProgressService()
    const result = await service.mergeGuestProgress(userId, body)
    return c.json(result)
  })

  return app
}
