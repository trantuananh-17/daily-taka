import type { WritingLesson } from "@/lib/learn/writing/types/lesson"

import { LESSON_01_COOKING_BREAKFAST } from "./lesson-01-cooking-breakfast"
import { LESSON_01_JP_N5_DAILY_LIFE } from "./lesson-01-jp-n5-daily-life"
import { LESSON_01_ZH_HSK1_DAILY_LIFE } from "./lesson-01-zh-hsk1-daily-life"

const LESSONS: Record<string, WritingLesson> = {
  "lesson-01": LESSON_01_COOKING_BREAKFAST,
  "lesson-01-zh-hsk1": LESSON_01_ZH_HSK1_DAILY_LIFE,
  "lesson-01-jp-n5": LESSON_01_JP_N5_DAILY_LIFE,
}

export function getWritingLessonById(id: string): WritingLesson | null {
  const lesson = LESSONS[id]
  if (!lesson) return null
  return {
    ...lesson,
    progress: {
      ...lesson.progress,
      doneSentenceIndexes: [...lesson.progress.doneSentenceIndexes],
      drafts: { ...(lesson.progress.drafts ?? {}) },
    },
    sentences: lesson.sentences.map((sentence) => ({ ...sentence })),
  }
}
