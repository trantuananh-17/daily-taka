import {
  createListeningPublicClient,
  type ListeningPublicClient,
} from "@dailytaka/backend/listening-public-client"

import { getPublicApiBaseUrl } from "@/lib/api/env"
import { listeningFetchInit } from "@/lib/learn/listening/listening-fetch"
import { unwrapHonoJson } from "@/lib/api/unwrap-hono-json"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { normalizeDictationLessonDetail } from "@/lib/learn/listening/normalize-lesson-detail"
import type {
  DictationLessonDetail,
  ListeningCategoryDetail,
  ListeningCategoryListResponse,
  ListeningLesson,
  ListeningLessonSearchResponse,
} from "@/lib/learn/listening/types"

let listeningClient: ListeningPublicClient | undefined

function getListeningClient(): ListeningPublicClient {
  if (!listeningClient) {
    listeningClient = createListeningPublicClient(getPublicApiBaseUrl(), {
      fetch: (input, init) => fetch(input, listeningFetchInit(init)),
    })
  }
  return listeningClient
}

/** Full API client (health, admin later). Listen reads use `getListeningClient()`. */
export { createListeningPublicClient, getListeningClient as getListeningHonoClient }

export async function apiGetListeningCategories(language: LanguageHubCode) {
  const res = await getListeningClient().v1.languages[":languageCode"].listening.categories.$get({
    param: { languageCode: language },
  })
  return unwrapHonoJson<ListeningCategoryListResponse>(res)
}

export async function apiGetListeningCategoryDetail(
  language: LanguageHubCode,
  categorySlug: string,
) {
  const res = await getListeningClient().v1.languages[":languageCode"].listening.categories[
    ":categorySlug"
  ].$get({
    param: { languageCode: language, categorySlug },
  })
  return unwrapHonoJson<ListeningCategoryDetail>(res)
}

export async function apiGetListeningSectionLessons(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  level?: string,
) {
  const url = getListeningClient().v1.languages[":languageCode"].listening.categories[
    ":categorySlug"
  ].sections[":sectionId"].lessons.$url({
    param: { languageCode: language, categorySlug, sectionId },
    query: level && level !== "all" ? { level } : {},
  })
  const res = await fetch(url, listeningFetchInit())
  return unwrapHonoJson<ListeningLesson[]>(res)
}

export async function apiGetListeningLessonDetail(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  lessonSlug: string,
) {
  const res = await getListeningClient().v1.languages[":languageCode"].listening.categories[
    ":categorySlug"
  ].sections[":sectionId"].lessons[":lessonSlug"].$get({
    param: { languageCode: language, categorySlug, sectionId, lessonSlug },
  })
  const detail = await unwrapHonoJson<DictationLessonDetail>(res)
  return normalizeDictationLessonDetail(detail)
}

export async function apiSearchListeningLessons(
  language: LanguageHubCode,
  categorySlug: string,
  q: string,
  level: string,
) {
  const url = getListeningClient().v1.languages[":languageCode"].listening.categories[
    ":categorySlug"
  ].lessons.search.$url({
    param: { languageCode: language, categorySlug },
    query: { q, level },
  })
  const res = await fetch(url, listeningFetchInit())
  return unwrapHonoJson<ListeningLessonSearchResponse>(res)
}
