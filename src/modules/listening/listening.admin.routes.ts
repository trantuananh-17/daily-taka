import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { NotFoundError } from "../../shared/errors"
import {
  createCategoryBodySchema,
  createLessonBodySchema,
  createSectionBodySchema,
  updateCategoryBodySchema,
  updateLessonBodySchema,
  updateSectionBodySchema,
  updateSentenceBodySchema,
  upsertSentencesBodySchema,
} from "./listening.admin.dto"
import { ListeningAdminRepository } from "./listening.admin.repository"
import { ListeningAdminService } from "./listening.admin.service"
import { parseListeningLanguageCode } from "./listening.constants"

function createAdminService() {
  return new ListeningAdminService(new ListeningAdminRepository(db))
}

function parseJsonBody<T>(schema: { parse: (data: unknown) => T }, raw: unknown): T {
  return schema.parse(raw)
}

function languageParam(c: { req: { param: (key: string) => string } }) {
  const languageCode = parseListeningLanguageCode(c.req.param("languageCode") ?? "")
  if (!languageCode) throw new NotFoundError("Language")
  return languageCode
}

export function createListeningAdminRoutes() {
  const app = new Hono<AppEnv>()

  app.post("/categories", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(createCategoryBodySchema, await c.req.json())
    const service = createAdminService()
    const row = await service.createCategory(languageCode, body)
    return c.json(row, 201)
  })

  app.patch("/categories/:categoryId", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(updateCategoryBodySchema, await c.req.json())
    const service = createAdminService()
    const row = await service.updateCategory(languageCode, c.req.param("categoryId"), body)
    return c.json(row)
  })

  app.delete("/categories/:categoryId", async (c) => {
    const languageCode = languageParam(c)
    const service = createAdminService()
    await service.deleteCategory(languageCode, c.req.param("categoryId"))
    return c.body(null, 204)
  })

  app.post("/categories/:categoryId/sections", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(createSectionBodySchema, await c.req.json())
    const service = createAdminService()
    const row = await service.createSection(languageCode, c.req.param("categoryId"), body)
    return c.json(row, 201)
  })

  app.patch("/sections/:sectionId", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(updateSectionBodySchema, await c.req.json())
    const service = createAdminService()
    const row = await service.updateSection(languageCode, c.req.param("sectionId"), body)
    return c.json(row)
  })

  app.delete("/sections/:sectionId", async (c) => {
    const languageCode = languageParam(c)
    const service = createAdminService()
    await service.deleteSection(languageCode, c.req.param("sectionId"))
    return c.body(null, 204)
  })

  app.post("/sections/:sectionId/lessons", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(createLessonBodySchema, await c.req.json())
    const service = createAdminService()
    const row = await service.createLesson(languageCode, c.req.param("sectionId"), body)
    return c.json(row, 201)
  })

  app.patch("/lessons/:lessonId", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(updateLessonBodySchema, await c.req.json())
    const service = createAdminService()
    const row = await service.updateLesson(languageCode, c.req.param("lessonId"), body)
    return c.json(row)
  })

  app.delete("/lessons/:lessonId", async (c) => {
    const languageCode = languageParam(c)
    const service = createAdminService()
    await service.deleteLesson(languageCode, c.req.param("lessonId"))
    return c.body(null, 204)
  })

  app.put("/lessons/:lessonId/sentences", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(upsertSentencesBodySchema, await c.req.json())
    const service = createAdminService()
    const rows = await service.upsertLessonSentences(languageCode, c.req.param("lessonId"), body)
    return c.json({ sentences: rows })
  })

  app.patch("/sentences/:sentenceId", async (c) => {
    const languageCode = languageParam(c)
    const body = parseJsonBody(updateSentenceBodySchema, await c.req.json())
    const service = createAdminService()
    const row = await service.updateSentence(languageCode, c.req.param("sentenceId"), body)
    return c.json(row)
  })

  app.delete("/sentences/:sentenceId", async (c) => {
    const languageCode = languageParam(c)
    const service = createAdminService()
    await service.deleteSentence(languageCode, c.req.param("sentenceId"))
    return c.body(null, 204)
  })

  return app
}
