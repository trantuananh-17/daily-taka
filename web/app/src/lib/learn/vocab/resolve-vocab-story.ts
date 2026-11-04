import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  buildLevelSectionLessons,
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import { getVocabStoryById } from "@/lib/learn/vocab/mock/stories"
import type { VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"

/** EN A1 section 1 lessons 1–4 map to lesson-01…04 stories when available. */
export function resolveVocabStory(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
): VocabLessonStory | null {
  if (language !== "en" || level !== "A1") return null

  const topics = getLevelTopicSeeds(language, "vocab", level)
  const sections = buildLevelSectionSummaries({
    module: "vocab",
    language,
    level,
    topics,
  })
  const section = sections.find((row) => row.id === sectionId)
  if (!section || section.title !== "Food & Shopping") return null

  const lessons = buildLevelSectionLessons(sections, sectionId, level, "vocab")
  const lesson = lessons.find((row) => row.slug === lessonSlug)
  if (!lesson || lesson.index > 4) return null

  const storyId = `lesson-${String(lesson.index).padStart(2, "0")}`
  return getVocabStoryById(storyId)
}
