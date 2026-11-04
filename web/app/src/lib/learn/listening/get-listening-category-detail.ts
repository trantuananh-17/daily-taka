import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningCategoryDetail } from "@/lib/learn/listening/types"

import { getEnShortStoriesSectionSummaries } from "./mock/en-short-stories-sections"
import { getJpFolkTalesSectionSummaries } from "./mock/jp-folk-tales-sections"
import { getZhShortStoriesSectionSummaries } from "./mock/zh-short-stories-sections"
import { getListeningCategories } from "./get-listening-categories"

/** Mock section summaries keyed by language + category slug. */
const SECTION_MOCKS: Partial<
  Record<LanguageHubCode, Record<string, () => ListeningCategoryDetail["sections"]>>
> = {
  en: {
    "short-stories": () => getEnShortStoriesSectionSummaries(),
  },
  zh: {
    "short-stories": () => getZhShortStoriesSectionSummaries(),
  },
  jp: {
    "folk-tales": () => getJpFolkTalesSectionSummaries(),
  },
}

export async function getListeningCategoryDetail(
  language: LanguageHubCode,
  slug: string,
): Promise<ListeningCategoryDetail | null> {
  const { rows } = await getListeningCategories(language)
  const category = rows.find((row) => row.slug === slug)
  if (!category) {
    return null
  }

  const loadSections = SECTION_MOCKS[language]?.[slug]
  if (!loadSections) {
    return { category, sections: [] }
  }

  return {
    category,
    sections: loadSections(),
  }
}
