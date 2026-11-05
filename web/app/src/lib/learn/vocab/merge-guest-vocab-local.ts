import {
  clearGuestVocabProgressStore,
  readGuestVocabProgressEntries,
} from "@/lib/learn/vocab/guest-vocab-lesson-progress"
import { apiMergeGuestVocabData } from "@/lib/learn/vocab/vocab-user-api"
import { clearAllGuestCarryBuckets, readAllGuestCarryBuckets } from "@/lib/learn/vocab/weak-word-carry"

const MERGE_FLAG = "dailytaka:guest-vocab-merge-done:v1"

function hasGuestVocabData() {
  const lessons = readGuestVocabProgressEntries().filter((row) => row.language === "en")
  const carry = readAllGuestCarryBuckets()
  return lessons.length > 0 || carry.length > 0
}

export async function mergeGuestVocabIfNeeded(): Promise<boolean> {
  if (typeof window === "undefined") return false
  if (window.localStorage.getItem(MERGE_FLAG) === "1") return false
  if (!hasGuestVocabData()) {
    window.localStorage.setItem(MERGE_FLAG, "1")
    return false
  }

  const lessonEntries = readGuestVocabProgressEntries()
    .filter((row) => row.language === "en" && row.lessonId.includes("-vocab-"))
    .map((row) => ({
      language: "en" as const,
      lessonId: row.lessonId,
      sectionId: row.sectionId,
      level: row.level,
      storyId: row.storyId,
      status: row.status,
      currentStep: row.currentStep,
      masteredCount: row.masteredCount,
    }))

  const carryEntries = readAllGuestCarryBuckets()
    .filter((bucket) => bucket.words.length > 0)
    .map((bucket) => ({
      targetLessonId: bucket.targetKey,
      sourceLessonId: bucket.sourceLessonDbId ?? bucket.sourceStoryId ?? "",
      items: bucket.words.map((word) => ({
        wordId: word.id,
        reviewFlashcardRequired: true,
      })),
    }))
    .filter((row) => row.sourceLessonId.length > 0)

  await apiMergeGuestVocabData({ lessonEntries, carryEntries })

  clearGuestVocabProgressStore()
  clearAllGuestCarryBuckets()
  window.localStorage.setItem(MERGE_FLAG, "1")
  return true
}
