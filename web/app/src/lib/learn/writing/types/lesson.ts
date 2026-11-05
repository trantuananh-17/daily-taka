export type WritingInputKind = "latin" | "cjk"

export type WritingScriptModeDef = {
  id: string
  label: string
  inputKind: WritingInputKind
}

export type WritingPronunciationEntry = {
  word: string
  ipa?: string
  pinyin?: string
  romaji?: string
}

export type WritingSentence = {
  vi: string
  /** Default target (Hanzi / standard Japanese / English). */
  target: string
  /** ZH/JP alternate writing modes keyed by mode id. */
  targetsByMode?: Partial<Record<string, string>>
  pronunciationKind?: "ipa" | "pinyin" | "romaji"
  pronunciation?: WritingPronunciationEntry[]
  /** Hydrated from saved progress — not authored in static lesson files. */
  done?: boolean
}

export type WritingLessonProgress = {
  /** 0-based sentence to show when reopening the lesson. */
  currentSentenceIndex: number
  /** Sentence indexes finished (correct or skipped). */
  doneSentenceIndexes: number[]
  /** Partial answers keyed by sentence index (editable units). */
  drafts?: Record<number, string>
}

export type WritingLesson = {
  id: string
  title: string
  level: string
  sentences: WritingSentence[]
  scriptModes?: WritingScriptModeDef[]
  /** Default seed; merged with guest localStorage at runtime. */
  progress: WritingLessonProgress
  lessonDbId?: string
}
