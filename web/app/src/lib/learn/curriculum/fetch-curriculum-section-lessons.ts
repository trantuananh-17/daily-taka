import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  buildLevelSectionLessons,
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { CurriculumLesson, CurriculumModule } from "@/lib/learn/curriculum/types"
import { applyWritingLessonCatalogOverrides } from "@/lib/learn/writing/writing-lesson-catalog"

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
  const lessons = buildLevelSectionLessons(sections, sectionId, normalizedLevel, module)
  if (module !== "writing" || !section) return lessons

  return applyWritingLessonCatalogOverrides(
    language,
    normalizedLevel,
    section.title,
    lessons,
  )
}
