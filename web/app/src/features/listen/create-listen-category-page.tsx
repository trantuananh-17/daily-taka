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

/** Mock catalog slugs — compatible with nextConfig.cacheComponents. */
export function createListenCategoryStaticParams(language: LanguageHubCode) {
  return async function generateStaticParams() {
    const { rows } = await getListeningCategories(language)
    return rows.map((row) => ({ slug: row.slug }))
  }
}
