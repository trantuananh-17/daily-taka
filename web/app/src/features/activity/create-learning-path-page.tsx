import type { Metadata } from "next"

import { LearningPathPage } from "@/features/activity/learning-path-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

export function createLearningPathMetadata(language: LanguageHubCode): Metadata {
  const hub = LANGUAGE_HUBS[language]
  return {
    title: `Lộ trình học | ${hub.pageTitle} | ${APP_NAME}`,
    description: `Streak và lịch sử học — ${hub.breadcrumbLabel}.`,
  }
}

export function createLearningPathPage(language: LanguageHubCode) {
  return function LearningPathRoute() {
    return <LearningPathPage language={language} />
  }
}
