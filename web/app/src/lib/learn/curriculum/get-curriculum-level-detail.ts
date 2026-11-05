import type { LanguageHubCode } from "@/lib/learn/hub"
import { buildLevelSectionSummaries } from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { CurriculumModule, CurriculumSectionSummary } from "@/lib/learn/curriculum/types"
import { serverGetVocabLevelDetail } from "@/lib/learn/vocab/vocab-api-server"
import { serverGetWritingLevelDetail } from "@/lib/learn/writing/writing-api-server"

export type CurriculumLevelDetail = {
  level: string
  sections: CurriculumSectionSummary[]
}

function mergeVocabSectionsFromApi(
  sections: CurriculumSectionSummary[],
  api: Awaited<ReturnType<typeof serverGetVocabLevelDetail>>,
): CurriculumSectionSummary[] {
  if (!api?.topics.length) return sections

  return sections.map((section) => {
    const topic = api.topics.find((row) => row.sortOrder === section.sortOrder)
    if (!topic) return section
    return {
      ...section,
      title: topic.title,
      lessonCount: topic.lessons.length || section.lessonCount,
    }
  })
}

export async function getCurriculumLevelDetail(
  language: LanguageHubCode,
  module: CurriculumModule,
  level: string,
): Promise<CurriculumLevelDetail | null> {
  const normalizedLevel = decodeURIComponent(level)
  const topics = getLevelTopicSeeds(language, module, normalizedLevel)
  if (topics.length === 0) return null

  let sections = buildLevelSectionSummaries({
    module,
    language,
    level: normalizedLevel,
    topics,
  })

  if (module === "vocab") {
    const api = await serverGetVocabLevelDetail(language, normalizedLevel)
    sections = mergeVocabSectionsFromApi(sections, api)
  }

  if (module === "writing") {
    const api = await serverGetWritingLevelDetail(language, normalizedLevel)
    if (api?.topics.length) {
      sections = sections.map((section) => {
        const topic = api.topics.find((row) => row.sortOrder === section.sortOrder)
        if (!topic) return section
        return {
          ...section,
          title: topic.title,
          lessonCount: topic.lessons.length || section.lessonCount,
        }
      })
    }
  }

  return { level: normalizedLevel, sections }
}
