/** Shared tier-1 / tier-2 shapes for vocab & writing level catalogs (listen uses parallel types). */
export type CurriculumSectionSummary = {
  id: string
  title: string
  sortOrder: number
  lessonCount: number
  completedCount: number
}

export type CurriculumLesson = {
  id: string
  slug: string
  sectionId: string
  index: number
  title: string
  /** Words (vocab) or sentences (writing) — shown in lesson card meta. */
  itemCount: number
  level: string
  stars: number
}

export type CurriculumModule = "vocab" | "writing"
