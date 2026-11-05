import { getPublicApiBaseUrl } from "@/lib/api/env"
import { unwrapHonoJson } from "@/lib/api/unwrap-hono-json"
import { listeningFetchInit } from "@/lib/learn/listening/listening-fetch"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { WritingLesson } from "@/lib/learn/writing/types/lesson"

export type WritingLevelDetail = {
  language: string
  level: string
  topics: Array<{
    id: string
    slug: string
    title: string
    sortOrder: number
    completedCount?: number
    lessons: Array<{
      id: string
      slug: string
      title: string
      sentenceCount: number
      sortOrder: number
      progress?: { status: string; doneCount: number; isCompleted: boolean }
    }>
  }>
}

export async function apiGetWritingLevelDetail(language: LanguageHubCode, level: string) {
  const encodedLevel = encodeURIComponent(level)
  const res = await fetch(
    `${getPublicApiBaseUrl()}/v1/languages/${language}/writing/${encodedLevel}`,
    listeningFetchInit(),
  )
  return unwrapHonoJson<WritingLevelDetail>(res)
}

export async function apiGetWritingLesson(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
) {
  const encodedLevel = encodeURIComponent(level)
  const res = await fetch(
    `${getPublicApiBaseUrl()}/v1/languages/${language}/writing/${encodedLevel}/sections/${encodeURIComponent(sectionId)}/lessons/${encodeURIComponent(lessonSlug)}`,
    listeningFetchInit(),
  )
  return unwrapHonoJson<WritingLesson>(res)
}
