export type { CoverTheme, TopicCover, TopicCoverTone, TopicCoverVariant } from "@/lib/learn/listening/cover-theme"

export type ListeningCategory = {
  id: string
  name: string
  slug: string
  levels: string[]
  sort_order: number
  description: string | null
  /** UI copy until API returns description */
  descriptionVi?: string
  lessonCount: number
  cover: import("@/lib/learn/listening/cover-theme").TopicCover
}

export type ListeningCategoryListResponse = {
  next: string | null
  rows: ListeningCategory[]
  version: string
  complete: boolean
}

export type ListeningLessonProgress = {
  status: "not_started" | "in_progress" | "completed"
  completedSentenceCount: number
  isCompleted: boolean
  starCount: number
  isStarred: boolean
  completionCount: number
}

export type ListeningLesson = {
  id: string
  slug: string
  sectionId: string
  index: number
  title: string
  sentenceCount: number
  level: string
  /** Catalog metadata (not user star rating). */
  stars: number
  progress?: ListeningLessonProgress
}

export type DictationGradingOptions = {
  ignoreCase?: boolean
  ignorePunctuation?: boolean
}

export type DictationGradingDefaults = {
  ignoreCase: boolean
  ignorePunctuation: boolean
}

export type DictationSentence = {
  id?: string
  index: number
  transcript: string
  properNouns?: string[]
  startMs?: number
  endMs?: number
  durationLabel?: string
  /** Per-sentence override; falls back to lesson `gradingDefaults`. */
  grading?: DictationGradingOptions
  metadata?: {
    ipa?: string
    confidence?: number
  }
}

export type DictationLessonDetail = {
  lesson: ListeningLesson
  categorySlug: string
  categoryName: string
  sectionTitle: string
  /** Full-lesson audio; sentence playback uses startMs/endMs when present. */
  audioUrl?: string
  durationMs?: number
  gradingDefaults?: DictationGradingDefaults
  sentences: DictationSentence[]
  nextLesson: Pick<ListeningLesson, "title" | "slug" | "sectionId" | "sentenceCount" | "level"> | null
}

/** Tier 1 — section list without lesson payloads. */
export type ListeningSectionSummary = {
  id: string
  title: string
  sortOrder: number
  lessonCount: number
  completedCount: number
  access?: "full" | "preview" | "locked"
}

export type ListeningCategoryDetail = {
  category: ListeningCategory
  sections: ListeningSectionSummary[]
}

export type ListeningLessonSearchHit = ListeningLesson & {
  sectionId: string
  sectionTitle: string
}

export type ListeningLessonSearchResponse = {
  sectionMatchCount: number
  hits: ListeningLessonSearchHit[]
}
