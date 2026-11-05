import {
  clearGuestWritingProgressStore,
  readGuestWritingStoreEntries,
} from "@/lib/learn/writing/guest-writing-lesson-progress"
import { apiMergeGuestWritingProgress } from "@/lib/learn/writing/writing-user-api"

const MERGE_FLAG = "dailytaka:guest-writing-merge-done:v1"

export async function mergeGuestWritingIfNeeded(): Promise<boolean> {
  if (typeof window === "undefined") return false
  if (window.localStorage.getItem(MERGE_FLAG) === "1") return false

  const entries = readGuestWritingStoreEntries().filter(
    (row) => row.language === "en" && row.lessonDbId?.includes("-writing-"),
  )
  if (entries.length === 0) {
    window.localStorage.setItem(MERGE_FLAG, "1")
    return false
  }

  await apiMergeGuestWritingProgress(
    entries.map((row) => ({
      language: "en",
      lessonId: row.lessonDbId!,
      sectionId: row.sectionId,
      level: row.level,
      lessonContentId: row.lessonContentId,
      status:
        row.doneSentenceIndexes.length > 0 &&
        row.status === "completed"
          ? "completed"
          : row.doneSentenceIndexes.length > 0
            ? "in_progress"
            : "in_progress",
      currentSentenceIndex: row.currentSentenceIndex,
      doneSentenceIndexes: row.doneSentenceIndexes,
      drafts: Object.fromEntries(
        Object.entries(row.drafts ?? {}).map(([k, v]) => [String(k), v]),
      ),
      scriptModeId: row.scriptModeId ?? null,
    })),
  )

  clearGuestWritingProgressStore()
  window.localStorage.setItem(MERGE_FLAG, "1")
  return true
}
