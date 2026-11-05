import type { Handler } from "hono"
import { Hono } from "hono"

import type { AppEnv } from "../../api/types"

export type WritingRouteHandlers = {
  getLevelDetail: Handler<AppEnv>
  getLessonBySection: Handler<AppEnv>
}

export function createWritingRoutesApp(handlers: WritingRouteHandlers) {
  return new Hono<AppEnv>()
    .get("/:levelCode", handlers.getLevelDetail)
    .get(
      "/:levelCode/sections/:sectionId/lessons/:lessonSlug",
      handlers.getLessonBySection,
    )
}
