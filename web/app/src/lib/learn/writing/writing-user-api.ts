import { getPublicApiBaseUrl } from "@/lib/api/env"
import { unwrapHonoJson } from "@/lib/api/unwrap-hono-json"
import { listeningFetchInit } from "@/lib/learn/listening/listening-fetch"
import type { WritingLessonProgress } from "@/lib/learn/writing/types/lesson"

export type UserWritingLessonProgress = WritingLessonProgress & {
  lessonId: string
  status: "in_progress" | "completed"
  doneCount: number
  isCompleted: boolean
  scriptModeId?: string | null
}

async function userJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getPublicApiBaseUrl()}${path}`, listeningFetchInit(init))
  return unwrapHonoJson<T>(res)
}

export function apiGetWritingLessonProgress(lessonDbId: string) {
  return userJson<{ progress: UserWritingLessonProgress | null }>(
    `/v1/user/writing/lessons/${encodeURIComponent(lessonDbId)}/progress`,
  )
}

export function apiPutWritingLessonProgress(
  lessonDbId: string,
  body: {
    status?: "in_progress" | "completed"
    currentSentenceIndex?: number
    doneSentenceIndexes?: number[]
    drafts?: Record<string, string>
    scriptModeId?: string | null
  },
) {
  return userJson<{ progress: UserWritingLessonProgress }>(
    `/v1/user/writing/lessons/${encodeURIComponent(lessonDbId)}/progress`,
    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}

export function apiMergeGuestWritingProgress(
  entries: Array<{
    language: "en"
    lessonId: string
    sectionId: string
    level: string
    lessonContentId: string
    status: "in_progress" | "completed"
    currentSentenceIndex: number
    doneSentenceIndexes: number[]
    drafts?: Record<string, string>
    scriptModeId?: string | null
  }>,
) {
  return userJson<{ merged: number; skipped: number }>("/v1/user/writing/guest-data/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  })
}
