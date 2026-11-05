import type { Metadata } from "next"

import { ListenCategoryPage } from "@/features/listen/listen-category-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"
import { getListeningCategories } from "@/lib/learn/listening/get-listening-categories"

/** Static metadata — dynamic `params` in generateMetadata blocks PPR (`cacheComponents`). */
export function createListenCategoryPageMetadata(language: LanguageHubCode): Metadata {
  const hub = LANGUAGE_HUBS[language]
  return {
    title: `Chủ đề | Nghe chép chính tả | ${hub.pageTitle} | ${APP_NAME}`,
    description: `Chọn section và bài nghe để luyện chép chính tả — ${hub.breadcrumbLabel}.`,
  }
}

export function createListenCategoryPage(language: LanguageHubCode) {
  return function ListenCategoryRoute() {
    return <ListenCategoryPage language={language} />
  }
}

/** Build-time fallback when API/DB unavailable — satisfies Cache Components (≥1 param). */
const LISTEN_CATEGORY_STATIC_FALLBACK: Record<LanguageHubCode, string[]> = {
  en: ["short-stories"],
  zh: ["short-stories"],
  jp: ["folk-tales"],
}

/** Catalog slugs from API, with mock fallback — compatible with nextConfig.cacheComponents. */
export function createListenCategoryStaticParams(language: LanguageHubCode) {
  return async function generateStaticParams() {
    const { rows } = await getListeningCategories(language)
    const fromApi = rows.map((row) => ({ slug: row.slug }))
    if (fromApi.length > 0) return fromApi
    return LISTEN_CATEGORY_STATIC_FALLBACK[language].map((slug) => ({ slug }))
  }
}
