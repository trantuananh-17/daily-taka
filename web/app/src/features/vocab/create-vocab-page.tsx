import type { Metadata } from "next"

import { VocabCatalogPage } from "@/features/vocab/vocab-catalog-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

export function createVocabPageMetadata(language: LanguageHubCode): Metadata {
  const hub = LANGUAGE_HUBS[language]
  return {
    title: `Học từ vựng | ${hub.pageTitle} | ${APP_NAME}`,
    description: `Chọn trình độ từ vựng — ${hub.breadcrumbLabel}.`,
  }
}

export function createVocabPage(language: LanguageHubCode) {
  return function VocabRoute() {
    return <VocabCatalogPage language={language} />
  }
}
