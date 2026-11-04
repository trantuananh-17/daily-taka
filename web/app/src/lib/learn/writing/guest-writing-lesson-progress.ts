import type { LanguageHubCode } from "@/lib/learn/hub"
import type { WritingLessonProgress } from "@/lib/learn/writing/types/lesson"

const STORAGE_KEY = "dailytaka:guest-writing-lesson-progress:v1"

export type GuestWritingLessonProgress = WritingLessonProgress & {
  language: LanguageHubCode
  level: string
  sectionId: string
  lessonContentId: string
  updatedAt: string
}

type GuestWritingLessonProgressStore = {
  version: 1
  entries: GuestWritingLessonProgress[]
}

export type GuestWritingLessonKey = {
  language: LanguageHubCode
  level: string
  sectionId: string
  lessonContentId: string
}

function readStore(): GuestWritingLessonProgressStore {
  if (typeof window === "undefined") {
    return { version: 1, entries: [] }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: 1, entries: [] }
    const parsed = JSON.parse(raw) as GuestWritingLessonProgressStore
    if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      return { version: 1, entries: [] }
    }
    return parsed
  } catch {
    return { version: 1, entries: [] }
  }
}

function writeStore(store: GuestWritingLessonProgressStore) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function entryKey(entry: GuestWritingLessonKey): string {
  return `${entry.language}:${entry.level}:${entry.sectionId}:${entry.lessonContentId}`
}

export function readGuestWritingLessonProgress(
  key: GuestWritingLessonKey,
): GuestWritingLessonProgress | null {
  const store = readStore()
  const id = entryKey(key)
  return store.entries.find((row) => entryKey(row) === id) ?? null
}

export function saveGuestWritingLessonProgress(
  key: GuestWritingLessonKey,
  payload: WritingLessonProgress,
) {
  const store = readStore()
  const id = entryKey(key)
  const nextEntry: GuestWritingLessonProgress = {
    ...key,
    ...payload,
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

export function applyProgressToSentences<T extends { done?: boolean }>(
  sentences: T[],
  progress: WritingLessonProgress,
): T[] {
  const doneSet = new Set(progress.doneSentenceIndexes)
  return sentences.map((sentence, index) => ({
    ...sentence,
    done: doneSet.has(index),
  }))
}
