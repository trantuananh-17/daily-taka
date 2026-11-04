/** Public JSON shapes aligned with web/app listening types (camelCase). */

export type ListeningCategoryDto = {
  id: string
  name: string
  slug: string
  levels: string[]
  sort_order: number
  description: string | null
  descriptionVi?: string
  lessonCount: number
  cover?: unknown
}

export type ListeningCategoryListDto = {
  next: string | null
  rows: ListeningCategoryDto[]
  version: string
  complete: boolean
}

export type ListeningSectionSummaryDto = {
  id: string
  title: string
  sortOrder: number
  lessonCount: number
  completedCount: number
  access?: "full" | "preview" | "locked"
}

export type ListeningLessonDto = {
  id: string
  slug: string
  sectionId: string
  index: number
  title: string
  sentenceCount: number
  level: string
  stars: number
}

export type DictationSentenceDto = {
  id?: string
  index: number
  transcript: string
  properNouns?: string[]
  startMs?: number
  endMs?: number
  durationLabel?: string
  grading?: { ignoreCase?: boolean; ignorePunctuation?: boolean }
  metadata?: { ipa?: string; confidence?: number }
}

export type DictationLessonDetailDto = {
  lesson: ListeningLessonDto
  categorySlug: string
  categoryName: string
  sectionTitle: string
  audioUrl?: string
  durationMs?: number
  gradingDefaults?: { ignoreCase: boolean; ignorePunctuation: boolean }
  sentences: DictationSentenceDto[]
  nextLesson: Pick<ListeningLessonDto, "title" | "slug" | "sectionId" | "sentenceCount" | "level"> | null
}

export type ListeningLessonSearchHitDto = ListeningLessonDto & {
  sectionTitle: string
}

export type ListeningLessonSearchDto = {
  sectionMatchCount: number
  hits: ListeningLessonSearchHitDto[]
}

export type ListeningCategoryDetailDto = {
  category: ListeningCategoryDto
  sections: ListeningSectionSummaryDto[]
}
