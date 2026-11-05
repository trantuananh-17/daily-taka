import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { NotFoundError } from "../../shared/errors"
import {
  createWritingLessonBodySchema,
  createWritingTopicBodySchema,
  updateWritingLessonBodySchema,
  upsertWritingSentencesBodySchema,
} from "./writing.admin.dto"
import { WritingAdminRepository } from "./writing.admin.repository"
import { WritingAdminService } from "./writing.admin.service"
import { parseWritingLanguageCode } from "./writing.constants"

function createService() {
  return new WritingAdminService(new WritingAdminRepository(db))
}

function languageParam(c: { req: { param: (key: string) => string } }) {
  const languageCode = parseWritingLanguageCode(c.req.param("languageCode") ?? "")
  if (!languageCode) throw new NotFoundError("Language")
  return languageCode
}

export function createWritingAdminRoutes() {
  const app = new Hono<AppEnv>()

  app.get("/lessons/:lessonId", async (c) => {
    const languageCode = languageParam(c)
    const body = await createService().getLessonWithSentences(languageCode, c.req.param("lessonId"))
    return c.json(body)
  })

  app.put("/lessons/:lessonId/sentences", async (c) => {
    const languageCode = languageParam(c)
    const payload = upsertWritingSentencesBodySchema.parse(await c.req.json())
    const sentences = await createService().upsertLessonSentences(
      languageCode,
      c.req.param("lessonId"),
      payload,
    )
    return c.json({ sentences })
  })

  app.patch("/lessons/:lessonId", async (c) => {
    const languageCode = languageParam(c)
    const body = updateWritingLessonBodySchema.parse(await c.req.json())
    const lesson = await createService().updateLesson(
      languageCode,
      c.req.param("lessonId"),
      body,
    )
    return c.json({ lesson })
  })

  app.post("/:levelCode/topics", async (c) => {
    const languageCode = languageParam(c)
    const body = createWritingTopicBodySchema.parse(await c.req.json())
    const topic = await createService().createTopic(
      languageCode,
      c.req.param("levelCode") ?? "",
      body,
    )
    return c.json({ topic }, 201)
  })

  app.post("/topics/:topicId/lessons", async (c) => {
    const languageCode = languageParam(c)
    const body = createWritingLessonBodySchema.parse(await c.req.json())
    const lesson = await createService().createLesson(
      languageCode,
      c.req.param("topicId"),
      body,
    )
    return c.json({ lesson }, 201)
  })

  app.get("/:levelCode", async (c) => {
    const languageCode = languageParam(c)
    const body = await createService().getLevelTree(languageCode, c.req.param("levelCode") ?? "")
    return c.json(body)
  })

  return app
}
