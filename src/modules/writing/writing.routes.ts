import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { attachOptionalUser } from "../../auth/attach-optional-user"
import { db } from "../../db/client"
import { NotFoundError } from "../../shared/errors"
import { parseWritingLanguageCode } from "./writing.constants"
import { WritingProgressRepository } from "./writing-progress.repository"
import { createWritingRoutesApp } from "./writing.routes.builder"
import { WritingRepository } from "./writing.repository"
import { WritingService } from "./writing.service"

function createPublicWritingService() {
  return new WritingService(new WritingRepository(db), new WritingProgressRepository(db))
}

const writingRoutesApp = createWritingRoutesApp({
  getLevelDetail: async (c) => {
    const languageCode = parseWritingLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")
    const userId = c.get("userId")
    const service = createPublicWritingService()
    const body = await service.getLevelDetail(
      languageCode,
      c.req.param("levelCode") ?? "",
      userId,
    )
    return c.json(body)
  },
  getLessonBySection: async (c) => {
    const languageCode = parseWritingLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")
    const userId = c.get("userId")
    const service = createPublicWritingService()
    const body = await service.getLessonBySection(
      languageCode,
      c.req.param("levelCode") ?? "",
      c.req.param("sectionId") ?? "",
      c.req.param("lessonSlug") ?? "",
      userId,
    )
    return c.json(body)
  },
})

export function createWritingRoutes() {
  const app = new Hono<AppEnv>()
  app.use("*", attachOptionalUser())
  app.route("/", writingRoutesApp)
  return app
}
