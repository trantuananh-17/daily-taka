import { getPublicApiBaseUrl } from "@/lib/api/env"
import { unwrapHonoJson } from "@/lib/api/unwrap-hono-json"
import { listeningFetchInit } from "@/lib/learn/listening/listening-fetch"
import type { VocabWord } from "@/lib/learn/vocab/types/lesson-story"

export type VocabWeakItem = {
  id: string
  wordId: string
  lessonId: string
  targetLessonId: string | null
  weakSource: string
  reviewFlashcardRequired: boolean
  status: string
  word: VocabWord
}

async function userJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getPublicApiBaseUrl()}${path}`, listeningFetchInit(init))
  return unwrapHonoJson<T>(res)
}

export function apiGetVocabWeakItems(lessonDbId: string) {
  return userJson<{ items: VocabWeakItem[] }>(
    `/v1/user/vocab/lessons/${encodeURIComponent(lessonDbId)}/weak-items`,
  )
}

export function apiPostVocabWeakItem(
  lessonDbId: string,
  body: {
    wordId: string
    lessonId: string
    weakSource:
      | "flashcard_again"
      | "matching_wrong"
      | "main_quiz_wrong"
      | "carried_from_lesson"
    reviewFlashcardRequired: boolean
    targetLessonId?: string
  },
) {
  return userJson<{ ok: boolean; id: string }>(
    `/v1/user/vocab/lessons/${encodeURIComponent(lessonDbId)}/weak-items`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}

export function apiClearVocabWeakItem(itemId: string) {
  return userJson<{ ok: boolean }>(`/v1/user/vocab/weak-items/${encodeURIComponent(itemId)}/clear`, {
    method: "PATCH",
  })
}

export type UserVocabLessonProgress = {
  lessonId: string
  status: "not_started" | "in_progress" | "completed"
  currentStep: string
  masteredCount: number
  isCompleted: boolean
  completedAt: string | null
}

export function apiGetVocabLessonProgress(lessonDbId: string) {
  return userJson<{ progress: UserVocabLessonProgress | null }>(
    `/v1/user/vocab/lessons/${encodeURIComponent(lessonDbId)}/progress`,
  )
}

export function apiPutVocabLessonProgress(
  lessonDbId: string,
  body: {
    status?: UserVocabLessonProgress["status"]
    currentStep?: string
    masteredCount?: number
  },
) {
  return userJson<{ progress: UserVocabLessonProgress }>(
    `/v1/user/vocab/lessons/${encodeURIComponent(lessonDbId)}/progress`,
    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}

export function apiCompleteVocabLesson(lessonDbId: string, masteredCount?: number) {
  return userJson<{ progress: UserVocabLessonProgress }>(
    `/v1/user/vocab/lessons/${encodeURIComponent(lessonDbId)}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ masteredCount }),
    },
  )
}

export function apiClearVocabWeakWord(lessonDbId: string, wordId: string) {
  return userJson<{ ok: boolean; cleared: number }>(
    `/v1/user/vocab/lessons/${encodeURIComponent(lessonDbId)}/weak-items/clear-word`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId, lessonId: lessonDbId }),
    },
  )
}

export function apiMergeGuestVocabData(body: {
  lessonEntries: Array<{
    language: "en"
    lessonId: string
    sectionId: string
    level: string
    storyId: string
    status: "in_progress" | "completed"
    currentStep?: string
    masteredCount: number
  }>
  carryEntries: Array<{
    targetLessonId: string
    sourceLessonId: string
    items: Array<{ wordId: string; reviewFlashcardRequired?: boolean }>
  }>
}) {
  return userJson<{ mergedLessons: number; skippedLessons: number; carryApplied: number }>(
    "/v1/user/vocab/guest-data/merge",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}

export function apiPostVocabCarry(
  targetLessonDbId: string,
  body: {
    sourceLessonId: string
    items: Array<{
      wordId: string
      reviewFlashcardRequired?: boolean
    }>
  },
) {
  return userJson<{ ok: boolean }>(
    `/v1/user/vocab/lessons/${encodeURIComponent(targetLessonDbId)}/carry`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}
