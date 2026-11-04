import type { CurriculumLesson, CurriculumSectionSummary } from "@/lib/learn/curriculum/types"
import { slugifyLessonTitle } from "@/lib/learn/listening/slug"

export type LevelTopicSeed = {
  title: string
  lessonCount: number
}

type BuildLevelSectionsOptions = {
  module: "vocab" | "writing"
  language: string
  level: string
  topics: LevelTopicSeed[]
}

export function buildLevelSectionSummaries({
  module,
  language,
  level,
  topics,
}: BuildLevelSectionsOptions): CurriculumSectionSummary[] {
  return topics.map((topic, index) => ({
    id: `section-${language}-${module}-${level.toLowerCase()}-${index + 1}`,
    title: topic.title,
    sortOrder: index + 1,
    lessonCount: topic.lessonCount,
    completedCount: 0,
  }))
}

export function buildLevelSectionLessons(
  sections: CurriculumSectionSummary[],
  sectionId: string,
  level: string,
  module: "vocab" | "writing",
): CurriculumLesson[] {
  const section = sections.find((row) => row.id === sectionId)
  if (!section) return []

  const unitLabel = module === "vocab" ? "từ" : "câu"
  return Array.from({ length: section.lessonCount }, (_, index) => {
    const lessonIndex = index + 1
    const title = `${section.title} — Bài ${String(lessonIndex).padStart(2, "0")}`
    return {
      id: `${sectionId}-lesson-${lessonIndex}`,
      slug: slugifyLessonTitle(title) || `lesson-${section.sortOrder}-${lessonIndex}`,
      sectionId,
      index: lessonIndex,
      title,
      itemCount: module === "vocab" ? 12 + (lessonIndex % 8) : 8 + (lessonIndex % 6),
      level,
      stars: (lessonIndex + section.sortOrder) % 5,
    }
  })
}

export function flattenLevelLessons(
  sections: CurriculumSectionSummary[],
  level: string,
  module: "vocab" | "writing",
): Array<CurriculumLesson & { sectionTitle: string }> {
  return sections.flatMap((section) => {
    const lessons = buildLevelSectionLessons(sections, section.id, level, module)
    return lessons.map((lesson) => ({ ...lesson, sectionTitle: section.title }))
  })
}

/** Card copy helper */
export function curriculumItemCountLabel(module: "vocab" | "writing", count: number): string {
  return module === "vocab" ? `${count} từ` : `${count} câu`
}
