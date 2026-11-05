import { adminApiRequest } from "@/lib/admin-api/client"
import type { ListenLanguageCode } from "@/features/listen/lib/listen-language"

export type ListeningCategory = {
  id: string
  languageCode: string
  slug: string
  name: string
  description: string | null
  descriptionVi: string | null
  sortOrder: number
  lessonCount: number
  levels: string[]
  isPublished: boolean
}

export type ListeningSection = {
  id: string
  categoryId: string
  sectionNumber: number
  title: string
  sortOrder: number
  access: string
}

export type ListeningLesson = {
  id: string
  sectionId: string
  categoryId: string
  languageCode: string
  slug: string
  title: string
  levelCode: string
  displayOrder: number
  sentenceCount: number
  durationMs: number | null
  stars: number
  templateType: string
  audioStorageKey: string | null
  audioPublicPath: string | null
  dictationGradingDefaults: { ignoreCase: boolean; ignorePunctuation: boolean } | null
  isPublished: boolean
}

export type ListeningSentence = {
  id: string
  lessonId: string
  position: number
  startMs: number
  endMs: number
  transcript: string
}

function base(lang: ListenLanguageCode) {
  return `/v1/admin/languages/${lang}/listening`
}

export async function fetchListeningCategories(lang: ListenLanguageCode) {
  const data = await adminApiRequest<{ categories: ListeningCategory[] }>(
    "GET",
    `${base(lang)}/categories`,
  )
  return data.categories
}

export async function fetchCategoryWithSections(lang: ListenLanguageCode, categoryId: string) {
  return adminApiRequest<{
    category: ListeningCategory
    sections: { section: ListeningSection; lessonCount: number }[]
  }>("GET", `${base(lang)}/categories/${encodeURIComponent(categoryId)}`)
}

export async function fetchSectionLessons(lang: ListenLanguageCode, sectionId: string) {
  return adminApiRequest<{ section: ListeningSection; lessons: ListeningLesson[] }>(
    "GET",
    `${base(lang)}/sections/${encodeURIComponent(sectionId)}`,
  )
}

export async function fetchLessonDetail(lang: ListenLanguageCode, lessonId: string) {
  return adminApiRequest<{ lesson: ListeningLesson; sentences: ListeningSentence[] }>(
    "GET",
    `${base(lang)}/lessons/${encodeURIComponent(lessonId)}`,
  )
}

export async function createListeningCategory(
  lang: ListenLanguageCode,
  body: {
    slug: string
    name: string
    description?: string | null
    descriptionVi?: string | null
    sortOrder?: number
    levels?: string[]
    isPublished?: boolean
  },
) {
  return adminApiRequest<ListeningCategory>("POST", `${base(lang)}/categories`, body)
}

export async function createListeningSection(
  lang: ListenLanguageCode,
  categoryId: string,
  body: {
    sectionNumber: number
    title: string
    sortOrder?: number
    access?: "full" | "preview" | "locked"
  },
) {
  return adminApiRequest<ListeningSection>(
    "POST",
    `${base(lang)}/categories/${encodeURIComponent(categoryId)}/sections`,
    body,
  )
}

export async function createListeningLesson(
  lang: ListenLanguageCode,
  sectionId: string,
  body: Record<string, unknown>,
) {
  return adminApiRequest<ListeningLesson>(
    "POST",
    `${base(lang)}/sections/${encodeURIComponent(sectionId)}/lessons`,
    body,
  )
}

export async function patchListeningLesson(
  lang: ListenLanguageCode,
  lessonId: string,
  body: Record<string, unknown>,
) {
  return adminApiRequest<ListeningLesson>(
    "PATCH",
    `${base(lang)}/lessons/${encodeURIComponent(lessonId)}`,
    body,
  )
}

export async function putListeningSentences(
  lang: ListenLanguageCode,
  lessonId: string,
  sentences: {
    position: number
    startMs: number
    endMs: number
    transcript: string
  }[],
) {
  return adminApiRequest<{ sentences: ListeningSentence[] }>(
    "PUT",
    `${base(lang)}/lessons/${encodeURIComponent(lessonId)}/sentences`,
    { sentences },
  )
}
