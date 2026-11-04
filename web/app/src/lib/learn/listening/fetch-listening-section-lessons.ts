import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningLesson } from "@/lib/learn/listening/types"

import { getEnShortStoriesLessonsForSection } from "./mock/en-short-stories-sections"
import { getJpFolkTalesLessonsForSection } from "./mock/jp-folk-tales-sections"
import { getZhShortStoriesLessonsForSection } from "./mock/zh-short-stories-sections"

type FetchSectionLessonsParams = {
  language: LanguageHubCode
  categorySlug: string
  sectionId: string
}

/** Tier 2 data only — UI applies mock latency when opening a section. */
export async function fetchListeningSectionLessons({
  language,
  categorySlug,
  sectionId,
}: FetchSectionLessonsParams): Promise<ListeningLesson[]> {
  if (language === "en" && categorySlug === "short-stories") {
    return getEnShortStoriesLessonsForSection(sectionId) ?? []
  }
  if (language === "zh" && categorySlug === "short-stories") {
    return getZhShortStoriesLessonsForSection(sectionId) ?? []
  }
  if (language === "jp" && categorySlug === "folk-tales") {
    return getJpFolkTalesLessonsForSection(sectionId) ?? []
  }

  return []
}
