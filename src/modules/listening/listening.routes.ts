import { Hono } from "hono"
import { z } from "zod"

import type { AppEnv } from "../../api/types"
import { attachOptionalUser } from "../../auth/attach-optional-user"
import { db } from "../../db/client"
import { NotFoundError } from "../../shared/errors"
import { parseListeningLanguageCode } from "./listening.constants"
import { createListeningRoutesApp } from "./listening.routes.builder"
import { ListeningProgressRepository } from "./listening-progress.repository"
import { ListeningRepository } from "./listening.repository"
import { ListeningService } from "./listening.service"

const levelQuerySchema = z.object({
  level: z.string().optional(),
})

const searchQuerySchema = z.object({
  q: z.string().optional().default(""),
  level: z.string().optional().default("all"),
})

function createListeningService() {
  return new ListeningService(new ListeningRepository(db), new ListeningProgressRepository(db))
}

function optionalUserId(c: { get: (key: "userId") => string | undefined }) {
  return c.get("userId")
}

function parseQuery<T extends z.ZodTypeAny>(schema: T, query: Record<string, string | string[]>) {
  const flat: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    flat[key] = Array.isArray(value) ? (value[0] ?? "") : value
  }
  return schema.parse(flat)
}

export const listeningRoutesApp = createListeningRoutesApp({
  listCategories: async (c) => {
    const languageCode = parseListeningLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const service = createListeningService()
    const body = await service.listCategories(languageCode)
    return c.json(body)
  },
  getCategoryDetail: async (c) => {
    const languageCode = parseListeningLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const service = createListeningService()
    const body = await service.getCategoryDetail(
      languageCode,
      c.req.param("categorySlug") ?? "",
      optionalUserId(c),
    )
    return c.json(body)
  },
  listSectionLessons: async (c) => {
    const languageCode = parseListeningLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const { level } = parseQuery(levelQuerySchema, c.req.query())
    const service = createListeningService()
    const body = await service.listSectionLessons(
      languageCode,
      c.req.param("categorySlug") ?? "",
      c.req.param("sectionId") ?? "",
      level,
      optionalUserId(c),
    )
    return c.json(body)
  },
  getLessonDetail: async (c) => {
    const languageCode = parseListeningLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const service = createListeningService()
    const body = await service.getLessonDetail(
      languageCode,
      c.req.param("categorySlug") ?? "",
      c.req.param("sectionId") ?? "",
      c.req.param("lessonSlug") ?? "",
    )
    return c.json(body)
  },
  searchLessons: async (c) => {
    const languageCode = parseListeningLanguageCode(c.req.param("languageCode") ?? "")
    if (!languageCode) throw new NotFoundError("Language")

    const { q, level } = parseQuery(searchQuerySchema, c.req.query())
    const service = createListeningService()
    const body = await service.searchLessons(
      languageCode,
      c.req.param("categorySlug") ?? "",
      q,
      level,
    )
    return c.json(body)
  },
})

export function createListeningRoutes() {
  const app = new Hono<AppEnv>()
  app.use("*", attachOptionalUser())
  app.route("/", listeningRoutesApp)
  return app
}
