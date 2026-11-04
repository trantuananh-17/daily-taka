import type { Metadata } from "next"

import { ListenCatalogPage } from "@/features/listen/listen-catalog-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

export function createListenPageMetadata(language: LanguageHubCode): Metadata {
  const hub = LANGUAGE_HUBS[language]
  return {
    title: `Nghe chép chính tả | ${hub.pageTitle} | ${APP_NAME}`,
    description: `Chọn chủ đề luyện nghe và chép chính tả — ${hub.breadcrumbLabel}.`,
  }
}

export function createListenPage(language: LanguageHubCode) {
  return function ListenRoute() {
    return <ListenCatalogPage language={language} />
  }
}
