import { notFound } from "next/navigation"

import { VocabLessonPageView } from "@/features/vocab/vocab-lesson-page-view"
import {
  buildLevelSectionLessons,
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getVocabLevels } from "@/lib/learn/vocab/levels"
import { resolveVocabStory } from "@/lib/learn/vocab/resolve-vocab-story"
import { serverGetVocabLessonStory } from "@/lib/learn/vocab/vocab-api-server"
import { vocabCatalogHref, vocabLessonHref, vocabLevelHref } from "@/lib/learn/vocab/vocab-hrefs"

const VOCAB_TRAIL_LABEL = "Từ vựng"

type VocabLessonPageProps = {
  language: LanguageHubCode
  level: string
  sectionId: string
  lessonSlug: string
}

export async function VocabLessonPage({ language, level, sectionId, lessonSlug }: VocabLessonPageProps) {
  const decodedLevel = decodeURIComponent(level)
  const allowed = getVocabLevels(language).some((row) => row.level === decodedLevel)
  if (!allowed) notFound()

  const fromApi = await serverGetVocabLessonStory(language, decodedLevel, sectionId, lessonSlug)
  const story = fromApi ?? resolveVocabStory(language, decodedLevel, sectionId, lessonSlug)
  if (!story) notFound()

  const topics = getLevelTopicSeeds(language, "vocab", decodedLevel)
  const sections = buildLevelSectionSummaries({
    module: "vocab",
    language,
    level: decodedLevel,
    topics,
  })
  const section = sections.find((row) => row.id === sectionId)
  const lessons = buildLevelSectionLessons(sections, sectionId, decodedLevel, "vocab")
  const lessonIndex = lessons.findIndex((row) => row.slug === lessonSlug)
  const nextLesson = lessonIndex >= 0 ? lessons[lessonIndex + 1] : undefined
  const nextLessonHref = nextLesson
    ? vocabLessonHref(language, decodedLevel, sectionId, nextLesson.slug)
    : null

  return (
    <VocabLessonPageView
      language={language}
      level={decodedLevel}
      sectionId={sectionId}
      trail={[
        { label: VOCAB_TRAIL_LABEL, href: vocabCatalogHref(language) },
        { label: decodedLevel, href: vocabLevelHref(language, decodedLevel) },
        { label: section?.title ?? "Chủ đề" },
      ]}
      story={story}
      backHref={vocabLevelHref(language, decodedLevel)}
      nextLessonHref={nextLessonHref}
    />
  )
}
