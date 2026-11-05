import type { Handler } from "hono"
import { Hono } from "hono"

import type { AppEnv } from "../../api/types"

export type VocabRouteHandlers = {
  getLevelDetail: Handler<AppEnv>
  getLessonStory: Handler<AppEnv>
  getLessonStoryBySection: Handler<AppEnv>
}

export function createVocabRoutesApp(handlers: VocabRouteHandlers) {
  return new Hono<AppEnv>()
    .get("/:levelCode", handlers.getLevelDetail)
    .get("/:levelCode/sections/:sectionId/lessons/:lessonSlug", handlers.getLessonStoryBySection)
    .get("/:levelCode/topics/:topicSlug/lessons/:lessonSlug", handlers.getLessonStory)
}

const stubs: VocabRouteHandlers = {
  getLevelDetail: (c) => c.json({ language: "", level: "", topics: [] }),
  getLessonStory: (c) => c.json({ id: "", title: "", description: "", words: [] }),
  getLessonStoryBySection: (c) => c.json({ id: "", title: "", description: "", words: [] }),
}

export const vocabRoutesStubApp = createVocabRoutesApp(stubs)
