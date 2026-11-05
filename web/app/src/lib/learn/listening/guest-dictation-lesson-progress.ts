import type { LanguageHubCode } from "@/lib/learn/hub"

const STORAGE_KEY = "dailytaka:guest-dictation-lesson-progress:v1"

export type GuestDictationLessonProgress = {
  language: LanguageHubCode
  categorySlug: string
  sectionId: string
  lessonId: string
  /** Sentences answered correctly (Kiểm tra). */
  correctCount: number
  /** 0-based index of current sentence in player. */
  currentSentenceIndex: number
  updatedAt: string
}

type GuestDictationLessonProgressStore = {
  version: 1
  entries: GuestDictationLessonProgress[]
}

export type GuestDictationLessonKey = {
  language: LanguageHubCode
  categorySlug: string
  sectionId: string
  lessonId: string
}

export function readGuestDictationStoreEntries(): GuestDictationLessonProgress[] {
  return readStore().entries
}

function readStore(): GuestDictationLessonProgressStore {
  if (typeof window === "undefined") {
    return { version: 1, entries: [] }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: 1, entries: [] }
    const parsed = JSON.parse(raw) as GuestDictationLessonProgressStore
    if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      return { version: 1, entries: [] }
    }
    return parsed
  } catch {
    return { version: 1, entries: [] }
  }
}

function writeStore(store: GuestDictationLessonProgressStore) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function entryKey(entry: GuestDictationLessonKey): string {
  return `${entry.language}:${entry.categorySlug}:${entry.sectionId}:${entry.lessonId}`
}

export function readGuestDictationLessonProgress(
  key: GuestDictationLessonKey,
): GuestDictationLessonProgress | null {
  const store = readStore()
  const id = entryKey(key)
  return store.entries.find((row) => entryKey(row) === id) ?? null
}

export function saveGuestDictationLessonProgress(
  key: GuestDictationLessonKey,
  payload: Pick<GuestDictationLessonProgress, "correctCount" | "currentSentenceIndex">,
) {
  const store = readStore()
  const id = entryKey(key)
  const nextEntry: GuestDictationLessonProgress = {
    ...key,
    correctCount: payload.correctCount,
    currentSentenceIndex: payload.currentSentenceIndex,
    updatedAt: new Date().toISOString(),
  }
  const index = store.entries.findIndex((row) => entryKey(row) === id)
  const entries = [...store.entries]
  if (index === -1) {
    entries.push(nextEntry)
  } else {
    entries[index] = nextEntry
  }
  writeStore({ version: 1, entries })
}

export function clearGuestDictationLessonProgress(key: GuestDictationLessonKey) {
  const store = readStore()
  const id = entryKey(key)
  writeStore({
    version: 1,
    entries: store.entries.filter((row) => entryKey(row) !== id),
  })
}
