import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  buildLevelSectionSummaries,
  flattenLevelLessons,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { CurriculumLesson, CurriculumModule } from "@/lib/learn/curriculum/types"
import { mockNetworkDelay } from "@/lib/learn/listening/mock/mock-network-delay"

export type CurriculumLessonSearchHit = CurriculumLesson & {
  sectionTitle: string
}

type SearchCurriculumLessonsParams = {
  language: LanguageHubCode
  module: CurriculumModule
  level: string
  q: string
}

export async function searchCurriculumLessons({
  language,
  module,
  level,
  q,
}: SearchCurriculumLessonsParams): Promise<{
  sectionMatchCount: number
  hits: CurriculumLessonSearchHit[]
}> {
  await mockNetworkDelay()

  const normalizedLevel = decodeURIComponent(level)
  const topics = getLevelTopicSeeds(language, module, normalizedLevel)
  const sections = buildLevelSectionSummaries({
    module,
    language,
    level: normalizedLevel,
    topics,
  })

  const normalized = q.trim().toLowerCase()
  const all = flattenLevelLessons(sections, normalizedLevel, module)

  const hits = all.filter((lesson) => {
    if (!normalized) return true
    return (
      lesson.title.toLowerCase().includes(normalized) ||
      lesson.sectionTitle.toLowerCase().includes(normalized)
    )
  })

  const sectionIds = new Set(hits.map((hit) => hit.sectionId))
  return { sectionMatchCount: sectionIds.size, hits }
}
