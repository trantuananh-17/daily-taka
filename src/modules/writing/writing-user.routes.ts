import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { requireUserAuth } from "../../auth/require-user-auth"
import {
  guestWritingMergeBodySchema,
  upsertWritingProgressBodySchema,
} from "./writing-progress.dto"
import { WritingProgressRepository } from "./writing-progress.repository"
import { WritingProgressService } from "./writing-progress.service"

function createProgressService() {
  return new WritingProgressService(new WritingProgressRepository(db))
}

export function createWritingUserRoutes() {
  const app = new Hono<AppEnv>()
  app.use("*", requireUserAuth())

  app.get("/lessons/:lessonId/progress", async (c) => {
    const userId = c.get("userId")!
    const progress = await createProgressService().getProgress(userId, c.req.param("lessonId"))
    return c.json({ progress })
  })

  app.put("/lessons/:lessonId/progress", async (c) => {
    const userId = c.get("userId")!
    const body = upsertWritingProgressBodySchema.parse(await c.req.json())
    const progress = await createProgressService().upsertProgress(userId, c.req.param("lessonId"), {
      ...body,
      drafts: body.drafts,
    })
    return c.json({ progress })
  })

  app.post("/guest-data/merge", async (c) => {
    const userId = c.get("userId")!
    const body = guestWritingMergeBodySchema.parse(await c.req.json())
    const result = await createProgressService().mergeGuestEntries(userId, body)
    return c.json(result)
  })

  return app
}
