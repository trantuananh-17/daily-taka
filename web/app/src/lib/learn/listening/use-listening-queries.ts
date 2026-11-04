"use client"

import { useQuery } from "@tanstack/react-query"

import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  apiGetListeningCategories,
  apiGetListeningCategoryDetail,
  apiGetListeningLessonDetail,
  apiGetListeningSectionLessons,
  apiSearchListeningLessons,
} from "@/lib/learn/listening/listening-api"
import { listeningKeys } from "@/lib/learn/listening/listening-query-keys"

export function useListeningCategoriesQuery(language: LanguageHubCode) {
  return useQuery({
    queryKey: listeningKeys.categories(language),
    queryFn: () => apiGetListeningCategories(language),
  })
}

export function useListeningCategoryDetailQuery(
  language: LanguageHubCode,
  categorySlug: string,
) {
  return useQuery({
    queryKey: listeningKeys.categoryDetail(language, categorySlug),
    queryFn: () => apiGetListeningCategoryDetail(language, categorySlug),
  })
}

export function useListeningSectionLessonsQuery(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  options: { enabled?: boolean; level?: string },
) {
  const { enabled = true, level } = options
  return useQuery({
    queryKey: listeningKeys.sectionLessons(language, categorySlug, sectionId, level),
    queryFn: () => apiGetListeningSectionLessons(language, categorySlug, sectionId, level),
    enabled,
  })
}

export function useListeningLessonDetailQuery(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  lessonSlug: string,
) {
  return useQuery({
    queryKey: listeningKeys.lessonDetail(language, categorySlug, sectionId, lessonSlug),
    queryFn: () => apiGetListeningLessonDetail(language, categorySlug, sectionId, lessonSlug),
  })
}

export function useListeningSearchQuery(
  language: LanguageHubCode,
  categorySlug: string,
  q: string,
  level: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: listeningKeys.search(language, categorySlug, q, level),
    queryFn: () => apiSearchListeningLessons(language, categorySlug, q, level),
    enabled,
  })
}
