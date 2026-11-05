import { getPublicApiBaseUrl } from "@/lib/api/env"
import { unwrapHonoJson } from "@/lib/api/unwrap-hono-json"
import { listeningFetchInit } from "@/lib/learn/listening/listening-fetch"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"

export type VocabLevelDetail = {
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
      description: string
      wordCount: number
      sortOrder: number
      progress?: {
        status: string
        masteredCount: number
        isCompleted: boolean
      }
    }>
  }>
}

export async function apiGetVocabLevelDetail(language: LanguageHubCode, level: string) {
  const encodedLevel = encodeURIComponent(level)
  const res = await fetch(
    `${getPublicApiBaseUrl()}/v1/languages/${language}/vocab/${encodedLevel}`,
    listeningFetchInit(),
  )
  return unwrapHonoJson<VocabLevelDetail>(res)
}

export async function apiGetVocabLessonStory(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
) {
  const encodedLevel = encodeURIComponent(level)
  const res = await fetch(
    `${getPublicApiBaseUrl()}/v1/languages/${language}/vocab/${encodedLevel}/sections/${encodeURIComponent(sectionId)}/lessons/${encodeURIComponent(lessonSlug)}`,
    listeningFetchInit(),
  )
  return unwrapHonoJson<VocabLessonStory>(res)
}
