import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { NotFoundError } from "../../shared/errors"
import {
  createVocabLessonBodySchema,
  createVocabTopicBodySchema,
  updateVocabLessonBodySchema,
  upsertVocabWordsBodySchema,
} from "./vocab.admin.dto"
import { VocabAdminRepository } from "./vocab.admin.repository"
import { VocabAdminService } from "./vocab.admin.service"
import { parseVocabLanguageCode } from "./vocab.constants"

function createService() {
  return new VocabAdminService(new VocabAdminRepository(db))
}

function languageParam(c: { req: { param: (key: string) => string } }) {
  const languageCode = parseVocabLanguageCode(c.req.param("languageCode") ?? "")
  if (!languageCode) throw new NotFoundError("Language")
  return languageCode
}

export function createVocabAdminRoutes() {
  const app = new Hono<AppEnv>()

  app.get("/lessons/:lessonId", async (c) => {
    const languageCode = languageParam(c)
    const service = createService()
    const body = await service.getLessonWithWords(languageCode, c.req.param("lessonId"))
    return c.json(body)
  })

  app.patch("/lessons/:lessonId", async (c) => {
    const languageCode = languageParam(c)
    const body = updateVocabLessonBodySchema.parse(await c.req.json())
    const service = createService()
    const lesson = await service.updateLesson(languageCode, c.req.param("lessonId"), body)
    return c.json({ lesson })
  })

  app.put("/lessons/:lessonId/words", async (c) => {
    const languageCode = languageParam(c)
    const body = upsertVocabWordsBodySchema.parse(await c.req.json())
    const service = createService()
    const words = await service.upsertLessonWords(languageCode, c.req.param("lessonId"), body)
    return c.json({ words })
  })

  app.post("/:levelCode/topics", async (c) => {
    const languageCode = languageParam(c)
    const body = createVocabTopicBodySchema.parse(await c.req.json())
    const topic = await createService().createTopic(
      languageCode,
      c.req.param("levelCode") ?? "",
      body,
    )
    return c.json({ topic }, 201)
  })

  app.post("/topics/:topicId/lessons", async (c) => {
    const languageCode = languageParam(c)
    const body = createVocabLessonBodySchema.parse(await c.req.json())
    const lesson = await createService().createLesson(
      languageCode,
      c.req.param("topicId"),
      body,
    )
    return c.json({ lesson }, 201)
  })

  app.get("/:levelCode", async (c) => {
    const languageCode = languageParam(c)
    const service = createService()
    const body = await service.getLevelTree(languageCode, c.req.param("levelCode") ?? "")
    return c.json(body)
  })

  return app
}
