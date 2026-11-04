import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningLessonSearchResponse } from "@/lib/learn/listening/types"

import { getEnShortStoriesAllLessons } from "./mock/en-short-stories-sections"
import { getJpFolkTalesAllLessons } from "./mock/jp-folk-tales-sections"
import { getZhShortStoriesAllLessons } from "./mock/zh-short-stories-sections"
import { mockNetworkDelay } from "./mock/mock-network-delay"

type SearchListeningLessonsParams = {
  language: LanguageHubCode
  categorySlug: string
  q: string
  level: string
}

/** Mock server search until GET .../lessons/search */
export async function searchListeningLessons({
  language,
  categorySlug,
  q,
  level,
}: SearchListeningLessonsParams): Promise<ListeningLessonSearchResponse> {
  await mockNetworkDelay()

  const normalized = q.trim().toLowerCase()
  let all: ReturnType<typeof getEnShortStoriesAllLessons> = []

  if (language === "en" && categorySlug === "short-stories") {
    all = getEnShortStoriesAllLessons()
  } else if (language === "zh" && categorySlug === "short-stories") {
    all = getZhShortStoriesAllLessons()
  } else if (language === "jp" && categorySlug === "folk-tales") {
    all = getJpFolkTalesAllLessons()
  } else {
    return { sectionMatchCount: 0, hits: [] }
  }

  const hits = all.filter((lesson) => {
    const matchesQuery = !normalized || lesson.title.toLowerCase().includes(normalized)
    const matchesLevel = level === "all" || lesson.level === level
    return matchesQuery && matchesLevel
  })

  const sectionIds = new Set(hits.map((hit) => hit.sectionId))

  return {
    sectionMatchCount: sectionIds.size,
    hits,
  }
}
