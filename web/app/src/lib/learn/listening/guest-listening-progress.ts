import type { LanguageHubCode } from "@/lib/learn/hub"

const STORAGE_KEY = "dailytaka:guest-listening-progress:v1"

export type GuestLessonStatus = "in_progress" | "completed"

export type GuestListeningProgressEntry = {
  language: LanguageHubCode
  categorySlug: string
  lessonId: string
  sectionId: string
  status: GuestLessonStatus
  completedAt?: string
}

type GuestListeningProgressStore = {
  version: 1
  updatedAt: string
  entries: GuestListeningProgressEntry[]
}

function readStore(): GuestListeningProgressStore {
  if (typeof window === "undefined") {
    return { version: 1, updatedAt: "", entries: [] }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { version: 1, updatedAt: "", entries: [] }
    }
    const parsed = JSON.parse(raw) as GuestListeningProgressStore
    if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      return { version: 1, updatedAt: "", entries: [] }
    }
    return parsed
  } catch {
    return { version: 1, updatedAt: "", entries: [] }
  }
}

function writeStore(store: GuestListeningProgressStore) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function countGuestCompletedInSection(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
): number {
  const store = readStore()
  return store.entries.filter(
    (entry) =>
      entry.language === language &&
      entry.categorySlug === categorySlug &&
      entry.sectionId === sectionId &&
      entry.status === "completed",
  ).length
}

/** For future player / merge flow. */
export function upsertGuestLessonProgress(entry: GuestListeningProgressEntry) {
  const store = readStore()
  const index = store.entries.findIndex((row) => row.lessonId === entry.lessonId)
  const next = [...store.entries]
  if (index === -1) {
    next.push(entry)
  } else {
    next[index] = entry
  }
  writeStore({
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: next,
  })
}

export function readGuestProgressForMerge(): GuestListeningProgressEntry[] {
  return readStore().entries
}

export function clearGuestProgressStore() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}
