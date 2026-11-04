import type { ListeningLesson, ListeningSectionSummary } from "@/lib/learn/listening/types"
import { slugifyLessonTitle } from "@/lib/learn/listening/slug"

type LessonSeed = Omit<ListeningLesson, "id" | "index" | "slug" | "sectionId"> & {
  slug?: string
}

export type ListeningSectionCatalogConfig = {
  sectionIdStem: string
  lessonIdStem: string
  sectionCount?: number
  section1Lessons: LessonSeed[]
  levelForGenerated: (sectionNumber: number, lessonIndex: number) => string
}

function lessonCountForSection(sectionNumber: number): number {
  if (sectionNumber <= 7) return 15
  if (sectionNumber <= 16) return 20
  return 9
}

function sectionAccess(sortOrder: number): ListeningSectionSummary["access"] {
  if (sortOrder <= 2) return "preview"
  return "locked"
}

export function createListeningSectionCatalog(config: ListeningSectionCatalogConfig) {
  const sectionCount = config.sectionCount ?? 17

  function sectionIdForSortOrder(sortOrder: number): string {
    return sortOrder === 1
      ? `section-${config.sectionIdStem}-1`
      : `section-${config.sectionIdStem}-${sortOrder}`
  }

  function buildLessons(sectionNumber: number): ListeningLesson[] {
    const sectionId = sectionIdForSortOrder(sectionNumber)
    const count = lessonCountForSection(sectionNumber)
    if (sectionNumber === 1) {
      return config.section1Lessons.map((lesson, index) => ({
        ...lesson,
        id: `${config.lessonIdStem}-1-${index + 1}`,
        index: index + 1,
        sectionId,
        slug: lesson.slug ?? slugifyLessonTitle(lesson.title),
      }))
    }

    return Array.from({ length: count }, (_, index) => {
      const lessonIndex = index + 1
      const title = `Section ${sectionNumber} — Story ${String(lessonIndex).padStart(2, "0")}`
      return {
        id: `${config.lessonIdStem}-${sectionNumber}-${lessonIndex}`,
        index: lessonIndex,
        title,
        sentenceCount: 18 + ((sectionNumber + lessonIndex) % 8),
        level: config.levelForGenerated(sectionNumber, lessonIndex),
        stars: (sectionNumber + lessonIndex) % 5,
        sectionId,
        slug: slugifyLessonTitle(title),
      }
    })
  }

  function getSectionSummaries(): ListeningSectionSummary[] {
    return Array.from({ length: sectionCount }, (_, index) => {
      const sortOrder = index + 1
      return {
        id: sectionIdForSortOrder(sortOrder),
        title: `Section ${sortOrder}`,
        sortOrder,
        lessonCount: lessonCountForSection(sortOrder),
        completedCount: 0,
        access: sectionAccess(sortOrder),
      }
    })
  }

  const sectionSortById = new Map(
    getSectionSummaries().map((section) => [section.id, section.sortOrder]),
  )

  function findLesson(sectionId: string, lessonSlug: string): ListeningLesson | null {
    const sortOrder = sectionSortById.get(sectionId)
    if (!sortOrder) return null
    return buildLessons(sortOrder).find((lesson) => lesson.slug === lessonSlug) ?? null
  }

  function getLessonsForSection(sectionId: string): ListeningLesson[] | null {
    const sortOrder = sectionSortById.get(sectionId)
    if (!sortOrder) return null
    return buildLessons(sortOrder)
  }

  function getSectionTitle(sectionId: string): string | null {
    const sortOrder = sectionSortById.get(sectionId)
    if (!sortOrder) return null
    return `Section ${sortOrder}`
  }

  function getAllLessons(): Array<ListeningLesson & { sectionId: string; sectionTitle: string }> {
    return getSectionSummaries().flatMap((section) => {
      const lessons = buildLessons(section.sortOrder)
      return lessons.map((lesson) => ({
        ...lesson,
        sectionId: section.id,
        sectionTitle: section.title,
      }))
    })
  }

  return {
    buildLessons,
    findLesson,
    getSectionSummaries,
    getLessonsForSection,
    getSectionTitle,
    getAllLessons,
  }
}
