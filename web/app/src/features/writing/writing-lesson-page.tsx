import { notFound } from "next/navigation"

import { WritingLessonPageView } from "@/features/writing/writing-lesson-page-view"
import {
  buildLevelSectionLessons,
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getWritingLevels } from "@/lib/learn/writing/levels"
import { resolveWritingLesson } from "@/lib/learn/writing/resolve-writing-lesson"
import { serverGetWritingLesson } from "@/lib/learn/writing/writing-api-server"
import { writingCatalogHref, writingLessonHref, writingLevelHref } from "@/lib/learn/writing/writing-hrefs"

const WRITING_TRAIL_LABEL = "Luyện viết"

type WritingLessonPageProps = {
  language: LanguageHubCode
  level: string
  sectionId: string
  lessonSlug: string
}

export async function WritingLessonPage({
  language,
  level,
  sectionId,
  lessonSlug,
}: WritingLessonPageProps) {
  const decodedLevel = decodeURIComponent(level)
  const allowed = getWritingLevels(language).some((row) => row.level === decodedLevel)
  if (!allowed) notFound()

  const fromApi = await serverGetWritingLesson(language, decodedLevel, sectionId, lessonSlug)
  const lesson = fromApi ?? resolveWritingLesson(language, decodedLevel, sectionId, lessonSlug)
  if (!lesson) notFound()

  const topics = getLevelTopicSeeds(language, "writing", decodedLevel)
  const sections = buildLevelSectionSummaries({
    module: "writing",
    language,
    level: decodedLevel,
    topics,
  })
  const section = sections.find((row) => row.id === sectionId)
  const lessons = buildLevelSectionLessons(sections, sectionId, decodedLevel, "writing")
  const lessonIndex = lessons.findIndex((row) => row.slug === lessonSlug)
  const nextLesson = lessonIndex >= 0 ? lessons[lessonIndex + 1] : undefined
  const nextLessonHref = nextLesson
    ? writingLessonHref(language, decodedLevel, sectionId, nextLesson.slug)
    : null

  return (
    <WritingLessonPageView
      language={language}
      level={decodedLevel}
      sectionId={sectionId}
      trail={[
        { label: WRITING_TRAIL_LABEL, href: writingCatalogHref(language) },
        { label: decodedLevel, href: writingLevelHref(language, decodedLevel) },
        { label: section?.title ?? "Chủ đề" },
      ]}
      lesson={lesson}
      backHref={writingLevelHref(language, decodedLevel)}
      nextLessonHref={nextLessonHref}
    />
  )
}
