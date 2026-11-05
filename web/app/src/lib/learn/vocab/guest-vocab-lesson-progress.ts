import type { LanguageHubCode } from "@/lib/learn/hub"
import type { VocabLessonStep } from "@/lib/learn/vocab/types/lesson-story"

const STORAGE_KEY = "dailytaka:guest-vocab-lesson-progress:v1"

export type GuestVocabLessonStatus = "in_progress" | "completed"

export type GuestVocabLessonProgressEntry = {
  language: LanguageHubCode
  level: string
  sectionId: string
  lessonId: string
  storyId: string
  status: GuestVocabLessonStatus
  currentStep: VocabLessonStep
  masteredCount: number
  completedAt?: string
}

type GuestVocabProgressStore = {
  version: 1
  updatedAt: string
  entries: GuestVocabLessonProgressEntry[]
}

function readStore(): GuestVocabProgressStore {
  if (typeof window === "undefined") {
    return { version: 1, updatedAt: "", entries: [] }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: 1, updatedAt: "", entries: [] }
    const parsed = JSON.parse(raw) as GuestVocabProgressStore
    if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      return { version: 1, updatedAt: "", entries: [] }
    }
    return parsed
  } catch {
    return { version: 1, updatedAt: "", entries: [] }
  }
}

function writeStore(store: GuestVocabProgressStore) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function readGuestVocabProgressEntries(): GuestVocabLessonProgressEntry[] {
  return readStore().entries
}

export function upsertGuestVocabLessonProgress(entry: GuestVocabLessonProgressEntry) {
  const store = readStore()
  const index = store.entries.findIndex(
    (row) => row.lessonId === entry.lessonId || row.storyId === entry.storyId,
  )
  const next = [...store.entries]
  if (index === -1) next.push(entry)
  else next[index] = entry
  writeStore({ version: 1, updatedAt: new Date().toISOString(), entries: next })
}

export function countGuestVocabCompletedInSection(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
): number {
  const normalizedLevel = decodeURIComponent(level)
  return readStore().entries.filter(
    (entry) =>
      entry.language === language &&
      entry.level === normalizedLevel &&
      entry.sectionId === sectionId &&
      entry.status === "completed",
  ).length
}

export function clearGuestVocabProgressStore() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}
