import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { attachOptionalUser } from "../../auth/attach-optional-user"
import { db } from "../../db/client"
import { NotFoundError } from "../../shared/errors"
import { parseVocabLanguageCode } from "./vocab.constants"
import { VocabProgressRepository } from "./vocab-progress.repository"
import { createVocabRoutesApp } from "./vocab.routes.builder"
import { VocabRepository } from "./vocab.repository"
import { VocabService } from "./vocab.service"

function createPublicVocabService() {
  return new VocabService(new VocabRepository(db), new VocabProgressRepository(db))
}

const vocabRoutesApp = createVocabRoutesApp({
  getLevelDetail: async (c) => {
    const languageCode = parseVocabLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const userId = c.get("userId")
    const service = createPublicVocabService()
    const body = await service.getLevelDetail(
      languageCode,
      c.req.param("levelCode") ?? "",
      userId,
    )
    return c.json(body)
  },
  getLessonStory: async (c) => {
    const languageCode = parseVocabLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const service = createPublicVocabService()
    const body = await service.getLessonStory(
      languageCode,
      c.req.param("levelCode") ?? "",
      c.req.param("topicSlug") ?? "",
      c.req.param("lessonSlug") ?? "",
    )
    return c.json(body)
  },
  getLessonStoryBySection: async (c) => {
    const languageCode = parseVocabLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const userId = c.get("userId")
    const service = createPublicVocabService()
    const body = await service.getLessonStoryBySection(
      languageCode,
      c.req.param("levelCode") ?? "",
      c.req.param("sectionId") ?? "",
      c.req.param("lessonSlug") ?? "",
      userId,
    )
    return c.json(body)
  },
})

export function createVocabRoutes() {
  const app = new Hono<AppEnv>()
  app.use("*", attachOptionalUser())
  app.route("/", vocabRoutesApp)
  return app
}
