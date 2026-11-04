import type { Metadata } from "next"

import { ListenCategoryPage } from "@/features/listen/listen-category-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"
import { getListeningCategoryDetail } from "@/lib/learn/listening/get-listening-category-detail"
import { getListeningCategories } from "@/lib/learn/listening/get-listening-categories"

type ListenCategoryRouteProps = {
  params: Promise<{ slug: string }>
}

export function createListenCategoryPageMetadata(language: LanguageHubCode) {
  return async function generateMetadata({ params }: ListenCategoryRouteProps): Promise<Metadata> {
    const { slug } = await params
    const detail = await getListeningCategoryDetail(language, slug)
    const hub = LANGUAGE_HUBS[language]

    if (!detail) {
      return { title: `Không tìm thấy | ${APP_NAME}` }
    }

    return {
      title: `${detail.category.name} | Nghe chép chính tả | ${hub.pageTitle} | ${APP_NAME}`,
      description:
        detail.category.descriptionVi ??
        detail.category.description ??
        `Luyện nghe chủ đề ${detail.category.name}.`,
    }
  }
}

export function createListenCategoryPage(language: LanguageHubCode) {
  return async function ListenCategoryRoute({ params }: ListenCategoryRouteProps) {
    const { slug } = await params
    return <ListenCategoryPage language={language} slug={slug} />
  }
}

/** Mock catalog slugs — compatible with nextConfig.cacheComponents. */
export function createListenCategoryStaticParams(language: LanguageHubCode) {
  return async function generateStaticParams() {
    const { rows } = await getListeningCategories(language)
    return rows.map((row) => ({ slug: row.slug }))
  }
}
