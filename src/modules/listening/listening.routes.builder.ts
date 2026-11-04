import type { Handler } from "hono"
import { Hono } from "hono"

import type { AppEnv } from "../../api/types"

export type ListeningRouteHandlers = {
  listCategories: Handler<AppEnv>
  getCategoryDetail: Handler<AppEnv>
  listSectionLessons: Handler<AppEnv>
  getLessonDetail: Handler<AppEnv>
  searchLessons: Handler<AppEnv>
}

/** Chained `.get()` keeps route types for hono/client. */
export function createListeningRoutesApp(handlers: ListeningRouteHandlers) {
  return new Hono<AppEnv>()
    .get("/categories", handlers.listCategories)
    .get("/categories/:categorySlug", handlers.getCategoryDetail)
    .get("/categories/:categorySlug/sections/:sectionId/lessons", handlers.listSectionLessons)
    .get(
      "/categories/:categorySlug/sections/:sectionId/lessons/:lessonSlug",
      handlers.getLessonDetail,
    )
    .get("/categories/:categorySlug/lessons/search", handlers.searchLessons)
}

/** Stub handlers only — safe to import from Next client (no pg/db). */
const listeningRouteStubs: ListeningRouteHandlers = {
  listCategories: (c) => c.json({ categories: [], levels: [] }),
  getCategoryDetail: (c) => c.json({ category: null, sections: [] }),
  listSectionLessons: (c) => c.json({ lessons: [], level: "all" }),
  getLessonDetail: (c) => c.json({ lesson: null, sentences: [] }),
  searchLessons: (c) => c.json({ results: [], query: "", level: "all" }),
}

export const listeningRoutesStubApp = createListeningRoutesApp(listeningRouteStubs)
