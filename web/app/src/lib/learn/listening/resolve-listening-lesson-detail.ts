import type { LanguageHubCode } from "@/lib/learn/hub"
import type { DictationLessonDetail, ListeningLesson } from "@/lib/learn/listening/types"

import { formatDictationSegmentDuration } from "./dictation-time"
import { mapListeningLessonDetailFixture } from "./map-lesson-detail-fixture"
import type { ListeningLessonDetailFixture } from "./mock/first-snow-fall-lesson.fixture"
import { FIRST_SNOW_FALL_LESSON_FIXTURE } from "./mock/first-snow-fall-lesson.fixture"
import { FIRST_SNOW_JP_LESSON_FIXTURE } from "./mock/first-snow-jp-lesson.fixture"
import { FIRST_SNOW_ZH_LESSON_FIXTURE } from "./mock/first-snow-zh-lesson.fixture"
import {
  buildEnShortStoriesLessons,
  findEnShortStoriesLesson,
  getEnShortStoriesSectionTitle,
} from "./mock/en-short-stories-sections"
import {
  buildJpFolkTalesLessons,
  findJpFolkTalesLesson,
  getJpFolkTalesSectionTitle,
} from "./mock/jp-folk-tales-sections"
import {
  buildZhShortStoriesLessons,
  findZhShortStoriesLesson,
  getZhShortStoriesSectionTitle,
} from "./mock/zh-short-stories-sections"

type ListeningLessonCatalog = {
  categorySlug: string
  findLesson: (sectionId: string, lessonSlug: string) => ListeningLesson | null
  getSectionTitle: (sectionId: string) => string | null
  buildSectionLessons: (sectionNumber: number) => ListeningLesson[]
  sectionNumberFromId: (sectionId: string) => number | null
  fixturesBySlug: Record<string, ListeningLessonDetailFixture>
}

function sectionNumberFromStem(sectionId: string, stem: string): number | null {
  const match = sectionId.match(new RegExp(`^section-${stem}-(\\d+)$`))
  if (!match) return null
  return Number.parseInt(match[1] ?? "", 10)
}

const CATALOGS: Partial<Record<LanguageHubCode, ListeningLessonCatalog[]>> = {
  en: [
    {
      categorySlug: "short-stories",
      findLesson: findEnShortStoriesLesson,
      getSectionTitle: getEnShortStoriesSectionTitle,
      buildSectionLessons: buildEnShortStoriesLessons,
      sectionNumberFromId: (sectionId) => sectionNumberFromStem(sectionId, "en-short-stories"),
      fixturesBySlug: {
        "first-snow-fall": FIRST_SNOW_FALL_LESSON_FIXTURE,
      },
    },
  ],
  zh: [
    {
      categorySlug: "short-stories",
      findLesson: findZhShortStoriesLesson,
      getSectionTitle: getZhShortStoriesSectionTitle,
      buildSectionLessons: buildZhShortStoriesLessons,
      sectionNumberFromId: (sectionId) => sectionNumberFromStem(sectionId, "zh-short-stories"),
      fixturesBySlug: {
        "first-snow": FIRST_SNOW_ZH_LESSON_FIXTURE,
      },
    },
  ],
  jp: [
    {
      categorySlug: "folk-tales",
      findLesson: findJpFolkTalesLesson,
      getSectionTitle: getJpFolkTalesSectionTitle,
      buildSectionLessons: buildJpFolkTalesLessons,
      sectionNumberFromId: (sectionId) => sectionNumberFromStem(sectionId, "jp-folk-tales"),
      fixturesBySlug: {
        "the-cranes-reward": FIRST_SNOW_JP_LESSON_FIXTURE,
      },
    },
  ],
}

export function resolveListeningLessonDetail(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  lessonSlug: string,
  categoryName: string,
): DictationLessonDetail | null {
  const catalog = CATALOGS[language]?.find((row) => row.categorySlug === categorySlug)
  if (!catalog) return null

  const lesson = catalog.findLesson(sectionId, lessonSlug)
  if (!lesson) return null

  const sectionTitle = catalog.getSectionTitle(sectionId) ?? sectionId
  const sectionNumber = catalog.sectionNumberFromId(sectionId)
  const allInSection = sectionNumber ? catalog.buildSectionLessons(sectionNumber) : []
  const currentIdx = allInSection.findIndex((row) => row.slug === lessonSlug)
  const next = currentIdx >= 0 && currentIdx < allInSection.length - 1 ? allInSection[currentIdx + 1] : null

  const nextLesson = next
    ? {
        title: next.title,
        slug: next.slug,
        sectionId: next.sectionId,
        sentenceCount: next.sentenceCount,
        level: next.level,
      }
    : null

  const fixture = catalog.fixturesBySlug[lessonSlug]
  if (fixture) {
    return mapListeningLessonDetailFixture(fixture, lesson, categorySlug, categoryName, nextLesson)
  }

  const sentences = Array.from({ length: lesson.sentenceCount }, (_, index) => ({
    index: index + 1,
    transcript: `Mock sentence ${index + 1} for ${lesson.title}.`,
    durationLabel: formatDictationSegmentDuration(2000),
  }))

  return {
    lesson,
    categorySlug,
    categoryName,
    sectionTitle,
    sentences,
    nextLesson,
  }
}
