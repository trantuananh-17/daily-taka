import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  buildLevelSectionLessons,
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import { getWritingLessonById } from "@/lib/learn/writing/mock/lessons"
import type { WritingLesson } from "@/lib/learn/writing/types/lesson"

function resolveCatalogLesson(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
  expectedSectionTitle: string,
  lessonContentId: string,
): WritingLesson | null {
  const topics = getLevelTopicSeeds(language, "writing", level)
  const sections = buildLevelSectionSummaries({
    module: "writing",
    language,
    level,
    topics,
  })
  const section = sections.find((row) => row.id === sectionId)
  if (!section || section.title !== expectedSectionTitle) return null

  const lessons = buildLevelSectionLessons(sections, sectionId, level, "writing")
  const lesson = lessons.find((row) => row.slug === lessonSlug)
  if (!lesson || lesson.index !== 1) return null

  return getWritingLessonById(lessonContentId)
}

/** EN A1 · Daily Life · Bài 01 */
export function resolveWritingLesson(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
): WritingLesson | null {
  if (language === "en" && level === "A1") {
    return resolveCatalogLesson(
      language,
      level,
      sectionId,
      lessonSlug,
      "Daily Life",
      "lesson-01",
    )
  }

  if (language === "zh" && level === "HSK1") {
    return resolveCatalogLesson(
      language,
      level,
      sectionId,
      lessonSlug,
      "日常生活：入门初探",
      "lesson-01-zh-hsk1",
    )
  }

  if (language === "jp" && level === "N5") {
    return resolveCatalogLesson(
      language,
      level,
      sectionId,
      lessonSlug,
      "日常生活：基本の学び",
      "lesson-01-jp-n5",
    )
  }

  return null
}
