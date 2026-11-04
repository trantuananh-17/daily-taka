/** Minimal word payload carried into the next lesson’s “Ôn nhanh”. */
export type CarriedWeakWord = {
  id: string
  term: string
  ipa: string
  partOfSpeech: string
  meaningVi: string
  definition: string
  example: string
  exampleVi: string
}

const storageKey = (lessonId: string) => `dailytaka:vocab-weak:${lessonId}`

export function loadCarriedWeakWords(lessonId: string): CarriedWeakWord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = sessionStorage.getItem(storageKey(lessonId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as CarriedWeakWord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCarriedWeakWordsForLesson(
  nextLessonId: string,
  words: CarriedWeakWord[],
): void {
  if (typeof window === "undefined") return
  if (words.length === 0) {
    sessionStorage.removeItem(storageKey(nextLessonId))
    return
  }
  sessionStorage.setItem(storageKey(nextLessonId), JSON.stringify(words))
}

export function toCarriedWeakWord(word: {
  id: string
  term: string
  ipa: string
  partOfSpeech: string
  meaningVi: string
  definition: string
  example: string
  exampleVi: string
}): CarriedWeakWord {
  return {
    id: word.id,
    term: word.term,
    ipa: word.ipa,
    partOfSpeech: word.partOfSpeech,
    meaningVi: word.meaningVi,
    definition: word.definition,
    example: word.example,
    exampleVi: word.exampleVi,
  }
}
