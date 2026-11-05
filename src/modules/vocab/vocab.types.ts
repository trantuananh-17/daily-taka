export type VocabWordDto = {
  id: string
  term: string
  ipa: string
  partOfSpeech: string
  meaningVi: string
  definition: string
  example: string
  exampleVi: string
  collocations: string[]
  distractors: string[]
}

export type VocabLessonProgressDto = {
  status: "not_started" | "in_progress" | "completed"
  currentStep: string
  masteredCount: number
  isCompleted: boolean
}

export type VocabLessonStoryDto = {
  id: string
  title: string
  description: string
  words: VocabWordDto[]
  nextStory?: { id: string; title: string } | null
  lessonDbId: string
  nextLessonDbId?: string | null
  lessonProgress?: VocabLessonProgressDto | null
}

export type VocabLessonSummaryDto = {
  id: string
  slug: string
  title: string
  description: string
  wordCount: number
  sortOrder: number
  progress?: {
    status: string
    masteredCount: number
    isCompleted: boolean
  }
}

export type VocabTopicDto = {
  id: string
  slug: string
  title: string
  sortOrder: number
  lessons: VocabLessonSummaryDto[]
  completedCount?: number
}

export type VocabLevelDetailDto = {
  language: string
  level: string
  topics: VocabTopicDto[]
}

export type VocabWeakItemDto = {
  id: string
  wordId: string
  lessonId: string
  targetLessonId: string | null
  weakSource: string
  reviewFlashcardRequired: boolean
  status: string
  word: VocabWordDto
}
