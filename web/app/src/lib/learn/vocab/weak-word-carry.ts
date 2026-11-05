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

const CARRY_KEY_PREFIX = "dailytaka:vocab-weak:"

type CarryBucketStored = {
  v: 2
  sourceLessonDbId?: string
  sourceStoryId?: string
  words: CarriedWeakWord[]
}

const storageKey = (targetKey: string) => `${CARRY_KEY_PREFIX}${targetKey}`

function parseCarryRaw(raw: string): CarryBucketStored | null {
  try {
    const parsed = JSON.parse(raw) as CarryBucketStored | CarriedWeakWord[]
    if (Array.isArray(parsed)) {
      return { v: 2, words: parsed }
    }
    if (parsed?.v === 2 && Array.isArray(parsed.words)) return parsed
    return null
  } catch {
    return null
  }
}

export function loadCarriedWeakWords(targetStoryOrLessonKey: string): CarriedWeakWord[] {
  if (typeof window === "undefined") return []
  const raw = sessionStorage.getItem(storageKey(targetStoryOrLessonKey))
  if (!raw) return []
  return parseCarryRaw(raw)?.words ?? []
}

export type CarrySourceMeta = {
  sourceLessonDbId?: string
  sourceStoryId?: string
}

export function saveCarriedWeakWordsForLesson(
  nextTargetKey: string,
  source: CarrySourceMeta,
  words: CarriedWeakWord[],
): void {
  if (typeof window === "undefined") return
  if (words.length === 0) {
    sessionStorage.removeItem(storageKey(nextTargetKey))
    return
  }
  const payload: CarryBucketStored = {
    v: 2,
    sourceLessonDbId: source.sourceLessonDbId,
    sourceStoryId: source.sourceStoryId,
    words,
  }
  sessionStorage.setItem(storageKey(nextTargetKey), JSON.stringify(payload))
}

export function readAllGuestCarryBuckets(): Array<{
  targetKey: string
  sourceLessonDbId?: string
  sourceStoryId?: string
  words: CarriedWeakWord[]
}> {
  if (typeof window === "undefined") return []
  const out: Array<{
    targetKey: string
    sourceLessonDbId?: string
    sourceStoryId?: string
    words: CarriedWeakWord[]
  }> = []
  for (let i = 0; i < sessionStorage.length; i += 1) {
    const key = sessionStorage.key(i)
    if (!key?.startsWith(CARRY_KEY_PREFIX)) continue
    const targetKey = key.slice(CARRY_KEY_PREFIX.length)
    const raw = sessionStorage.getItem(key)
    if (!raw) continue
    const bucket = parseCarryRaw(raw)
    if (!bucket?.words.length) continue
    out.push({
      targetKey,
      sourceLessonDbId: bucket.sourceLessonDbId,
      sourceStoryId: bucket.sourceStoryId,
      words: bucket.words,
    })
  }
  return out
}

export function clearAllGuestCarryBuckets() {
  if (typeof window === "undefined") return
  const keys: string[] = []
  for (let i = 0; i < sessionStorage.length; i += 1) {
    const key = sessionStorage.key(i)
    if (key?.startsWith(CARRY_KEY_PREFIX)) keys.push(key)
  }
  for (const key of keys) sessionStorage.removeItem(key)
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
