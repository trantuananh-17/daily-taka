import type { VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"

import { LESSON_01 } from "./lesson-01"
import { LESSON_02 } from "./lesson-02"
import { LESSON_03 } from "./lesson-03"
import { LESSON_04 } from "./lesson-04"

/** Mock story bank — mirror future `vocabulary_lessons.content` JSON. */
export const VOCAB_STORY_BY_ID: Record<string, VocabLessonStory> = {
  "lesson-01": LESSON_01,
  "lesson-02": LESSON_02,
  "lesson-03": LESSON_03,
  "lesson-04": LESSON_04,
}

export function getVocabStoryById(id: string): VocabLessonStory | null {
  return VOCAB_STORY_BY_ID[id] ?? null
}
