/** Vocab lesson story payload (API/DB-shaped mock). */
export type VocabWord = {
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

export type VocabLessonStory = {
  id: string
  title: string
  description: string
  words: VocabWord[]
  /** Next story in sequence (mock). */
  nextStory?: Pick<VocabLessonStory, "id" | "title"> | null
}

export type VocabLessonStep =
  | "overview"
  | "intro"
  | "flashcard"
  | "matching"
  | "quiz"
  | "review"
  | "lessonComplete"

export type VocabQuizQuestionType =
  | "meaningChoice"
  | "listenChoice"
  | "clozeChoice"
  | "termFromMeaning"

export type VocabQuizQuestion = {
  id: string
  type: VocabQuizQuestionType
  wordId: string
  prompt: string
  options: string[]
  correctIndex: number
  example?: string
  exampleVi?: string
}
