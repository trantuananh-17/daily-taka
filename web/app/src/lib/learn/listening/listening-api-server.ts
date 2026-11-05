import { serverFetchJson } from "@/lib/api/server-fetch"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type {
  DictationLessonDetail,
  ListeningCategoryDetail,
  ListeningCategoryListResponse,
  ListeningLesson,
} from "@/lib/learn/listening/types"

/** Required for `generateMetadata` / `generateStaticParams` when `cacheComponents` is on. */
export const LISTENING_SERVER_REVALIDATE_SECONDS = 60

function serverFetch<T>(path: string): Promise<T | null> {
  return serverFetchJson<T>(path, { revalidateSeconds: LISTENING_SERVER_REVALIDATE_SECONDS })
}

export function serverGetListeningCategories(language: LanguageHubCode) {
  return serverFetch<ListeningCategoryListResponse>(
    `/v1/languages/${language}/listening/categories`,
  )
}

export function serverGetListeningCategoryDetail(language: LanguageHubCode, categorySlug: string) {
  return serverFetch<ListeningCategoryDetail>(
    `/v1/languages/${language}/listening/categories/${encodeURIComponent(categorySlug)}`,
  )
}

export function serverGetListeningSectionLessons(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  level?: string,
) {
  const params = new URLSearchParams()
  if (level && level !== "all") params.set("level", level)
  const qs = params.toString()
  const suffix = qs ? `?${qs}` : ""
  return serverFetch<ListeningLesson[]>(
    `/v1/languages/${language}/listening/categories/${encodeURIComponent(categorySlug)}/sections/${encodeURIComponent(sectionId)}/lessons${suffix}`,
  )
}

export function serverGetListeningLessonDetail(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  lessonSlug: string,
) {
  return serverFetch<DictationLessonDetail>(
    `/v1/languages/${language}/listening/categories/${encodeURIComponent(categorySlug)}/sections/${encodeURIComponent(sectionId)}/lessons/${encodeURIComponent(lessonSlug)}`,
  )
}
