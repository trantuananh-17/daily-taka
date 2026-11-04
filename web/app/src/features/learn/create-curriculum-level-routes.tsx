import type { Metadata } from "next"

import { APP_NAME } from "@/lib/brand"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { LANGUAGE_HUBS } from "@/lib/learn/hub"
import {
  buildLevelSectionSummaries,
  flattenLevelLessons,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { CurriculumModule } from "@/lib/learn/curriculum/types"
import { getVocabLevels } from "@/lib/learn/vocab/levels"
import { getWritingLevels } from "@/lib/learn/writing/levels"

type LevelRouteProps = {
  params: Promise<{ level: string }>
}

type LessonRouteProps = {
  params: Promise<{ level: string; sectionId: string; lessonSlug: string }>
}

function levelsForModule(language: LanguageHubCode, module: CurriculumModule): string[] {
  const rows = module === "vocab" ? getVocabLevels(language) : getWritingLevels(language)
  return rows.map((row) => row.level)
}

function allLessonParams(language: LanguageHubCode, module: CurriculumModule) {
  return levelsForModule(language, module).flatMap((level) => {
    const topics = getLevelTopicSeeds(language, module, level)
    const sections = buildLevelSectionSummaries({ module, language, level, topics })
    return flattenLevelLessons(sections, level, module).map((lesson) => ({
      level,
      sectionId: lesson.sectionId,
      lessonSlug: lesson.slug,
    }))
  })
}

export function createCurriculumLevelPageMetadata(
  language: LanguageHubCode,
  module: CurriculumModule,
  featureLabel: string,
) {
  return async function generateMetadata({ params }: LevelRouteProps): Promise<Metadata> {
    const { level } = await params
    const hub = LANGUAGE_HUBS[language]
    return {
      title: `${decodeURIComponent(level)} | ${featureLabel} | ${hub.pageTitle} | ${APP_NAME}`,
      description: `${featureLabel} — ${decodeURIComponent(level)}.`,
    }
  }
}

export function createCurriculumLevelStaticParams(
  language: LanguageHubCode,
  module: CurriculumModule,
) {
  return async function generateStaticParams() {
    return levelsForModule(language, module).map((level) => ({ level }))
  }
}

export function createCurriculumLessonPageMetadata(
  language: LanguageHubCode,
  module: CurriculumModule,
  featureLabel: string,
) {
  return async function generateMetadata({ params }: LessonRouteProps): Promise<Metadata> {
    const { level, lessonSlug } = await params
    const hub = LANGUAGE_HUBS[language]
    return {
      title: `${decodeURIComponent(lessonSlug)} | ${decodeURIComponent(level)} | ${featureLabel} | ${hub.pageTitle} | ${APP_NAME}`,
    }
  }
}

export function createCurriculumLessonStaticParams(
  language: LanguageHubCode,
  module: CurriculumModule,
) {
  return async function generateStaticParams() {
    return allLessonParams(language, module)
  }
}
