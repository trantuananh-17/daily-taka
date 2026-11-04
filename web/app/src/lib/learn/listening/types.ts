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
