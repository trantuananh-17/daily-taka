import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  buildLevelSectionLessons,
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { CurriculumLesson, CurriculumModule } from "@/lib/learn/curriculum/types"
import { applyWritingLessonCatalogOverrides } from "@/lib/learn/writing/writing-lesson-catalog"
import { apiGetVocabLevelDetail } from "@/lib/learn/vocab/vocab-api"
import { apiGetWritingLevelDetail } from "@/lib/learn/writing/writing-api"

type FetchCurriculumSectionLessonsParams = {
  language: LanguageHubCode
  module: CurriculumModule
  level: string
  sectionId: string
}

/** Tier 2 — UI applies mock latency when opening a section. */
export async function fetchCurriculumSectionLessons({
  language,
  module,
  level,
  sectionId,
}: FetchCurriculumSectionLessonsParams): Promise<CurriculumLesson[]> {
  const normalizedLevel = decodeURIComponent(level)
  const topics = getLevelTopicSeeds(language, module, normalizedLevel)
  const sections = buildLevelSectionSummaries({
    module,
    language,
    level: normalizedLevel,
    topics,
  })
  const section = sections.find((row) => row.id === sectionId)
  let lessons = buildLevelSectionLessons(sections, sectionId, normalizedLevel, module)

  if (module === "vocab" && section) {
    try {
      const detail = await apiGetVocabLevelDetail(language, normalizedLevel)
      const topic = detail.topics.find((row) => row.sortOrder === section.sortOrder)
      if (topic?.lessons.length) {
        lessons = topic.lessons.map((lesson) => ({
          id: lesson.id,
          slug: lesson.slug,
          sectionId,
          index: lesson.sortOrder,
          title: lesson.title,
          itemCount: lesson.wordCount,
          level: normalizedLevel,
          stars: lesson.progress?.isCompleted ? 1 : 0,
        }))
      }
    } catch {
      /* keep seed-built lessons */
    }
  }

  if (module === "writing" && section) {
    try {
      const detail = await apiGetWritingLevelDetail(language, normalizedLevel)
      const topic = detail.topics.find((row) => row.sortOrder === section.sortOrder)
      if (topic?.lessons.length) {
        lessons = topic.lessons.map((lesson) => ({
          id: lesson.id,
          slug: lesson.slug,
          sectionId,
          index: lesson.sortOrder,
          title: lesson.title,
          itemCount: lesson.sentenceCount,
          level: normalizedLevel,
          stars: lesson.progress?.isCompleted ? 1 : 0,
        }))
      }
    } catch {
      /* seed fallback */
    }
  }

  if (module !== "writing" || !section) return lessons

  return applyWritingLessonCatalogOverrides(
    language,
    normalizedLevel,
    section.title,
    lessons,
  )
}
