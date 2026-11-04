import type { Metadata } from "next"

import { WritingCatalogPage } from "@/features/writing/writing-catalog-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

export function createWritingPageMetadata(language: LanguageHubCode): Metadata {
  const hub = LANGUAGE_HUBS[language]
  return {
    title: `Luyện viết | ${hub.pageTitle} | ${APP_NAME}`,
    description: `Chọn trình độ luyện viết — ${hub.breadcrumbLabel}.`,
  }
}

export function createWritingPage(language: LanguageHubCode) {
  return function WritingRoute() {
    return <WritingCatalogPage language={language} />
  }
}
