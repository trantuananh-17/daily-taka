export type WritingScriptModeDto = {
  id: string
  label: string
  inputKind: "latin" | "cjk"
}

export type WritingPronunciationDto = {
  word: string
  ipa?: string
  pinyin?: string
  romaji?: string
}

export type WritingSentenceDto = {
  vi: string
  target: string
  targetsByMode?: Partial<Record<string, string>>
  pronunciationKind?: "ipa" | "pinyin" | "romaji"
  pronunciation?: WritingPronunciationDto[]
}

export type WritingLessonDto = {
  id: string
  title: string
  level: string
  sentences: WritingSentenceDto[]
  scriptModes?: WritingScriptModeDto[]
  lessonDbId: string
  progress: {
    currentSentenceIndex: number
    doneSentenceIndexes: number[]
    drafts: Record<number, string>
  }
}

export type WritingLessonSummaryDto = {
  id: string
  slug: string
  title: string
  sentenceCount: number
  sortOrder: number
  progress?: {
    status: string
    doneCount: number
    isCompleted: boolean
  }
}

export type WritingTopicDto = {
  id: string
  slug: string
  title: string
  sortOrder: number
  lessons: WritingLessonSummaryDto[]
  completedCount?: number
}

export type WritingLevelDetailDto = {
  language: string
  level: string
  topics: WritingTopicDto[]
}
