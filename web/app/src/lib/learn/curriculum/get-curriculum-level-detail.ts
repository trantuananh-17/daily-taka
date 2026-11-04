import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { CurriculumModule, CurriculumSectionSummary } from "@/lib/learn/curriculum/types"

export type CurriculumLevelDetail = {
  level: string
  sections: CurriculumSectionSummary[]
}

export function getCurriculumLevelDetail(
  language: LanguageHubCode,
  module: CurriculumModule,
  level: string,
): CurriculumLevelDetail | null {
  const normalizedLevel = decodeURIComponent(level)
  const topics = getLevelTopicSeeds(language, module, normalizedLevel)
  if (topics.length === 0) return null

  const sections = buildLevelSectionSummaries({
    module,
    language,
    level: normalizedLevel,
    topics,
  })

  return { level: normalizedLevel, sections }
}
