import { getPublicApiBaseUrl } from "@/lib/api/env"
import { unwrapHonoJson } from "@/lib/api/unwrap-hono-json"
import type { GuestDictationLessonProgress } from "@/lib/learn/listening/guest-dictation-lesson-progress"
import type { GuestListeningProgressEntry } from "@/lib/learn/listening/guest-listening-progress"
import { listeningFetchInit } from "@/lib/learn/listening/listening-fetch"
import type { ListeningPlaybackSettings } from "@/lib/learn/listening/listening-playback-settings"

export type UserListenLessonProgress = {
  lessonId: string
  status: "not_started" | "in_progress" | "completed"
  completedSentenceCount: number
  lastSentencePosition: number
  lastPositionMs: number | null
  completionCount: number
  completionCycleActive: boolean
  isStarred: boolean
  starCount: number
  completedAt: string | null
  isCompleted: boolean
}

async function userJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getPublicApiBaseUrl()}${path}`, listeningFetchInit(init))
  return unwrapHonoJson<T>(res)
}

export function apiGetListenLessonProgress(lessonId: string) {
  return userJson<{ progress: UserListenLessonProgress | null }>(
    `/v1/user/listening/lessons/${encodeURIComponent(lessonId)}/progress`,
  )
}

export function apiPutListenLessonProgress(
  lessonId: string,
  body: {
    status?: UserListenLessonProgress["status"]
    completedSentenceCount?: number
    lastSentencePosition?: number
    lastPositionMs?: number | null
    completionCycleActive?: boolean
  },
) {
  return userJson<{ progress: UserListenLessonProgress }>(
    `/v1/user/listening/lessons/${encodeURIComponent(lessonId)}/progress`,
    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}

export function apiCompleteListenLesson(lessonId: string) {
  return userJson<{ progress: UserListenLessonProgress }>(
    `/v1/user/listening/lessons/${encodeURIComponent(lessonId)}/complete`,
    { method: "POST" },
  )
}

export function apiRestartListenLesson(lessonId: string) {
  return userJson<{ progress: UserListenLessonProgress }>(
    `/v1/user/listening/lessons/${encodeURIComponent(lessonId)}/restart`,
    { method: "POST" },
  )
}

export function apiMergeGuestListeningProgress(body: {
  lessonEntries: GuestListeningProgressEntry[]
  dictationEntries: GuestDictationLessonProgress[]
  playbackSettings?: ListeningPlaybackSettings
}) {
  return userJson<{ mergedLessons: number; skipped: number; settingsMerged: boolean }>(
    "/v1/user/listening/guest-progress/merge",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}

export function apiGetUserSettings() {
  return userJson<{ preferences: { listeningPlayback?: ListeningPlaybackSettings } }>(
    "/v1/user/settings",
  )
}

export function apiPatchUserSettings(body: { listeningPlayback?: ListeningPlaybackSettings }) {
  return userJson<{ preferences: { listeningPlayback?: ListeningPlaybackSettings } }>(
    "/v1/user/settings",
    { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  )
}
