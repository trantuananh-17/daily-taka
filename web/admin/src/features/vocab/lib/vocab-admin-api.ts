import { adminApiRequest } from "@/lib/admin-api/client"
import type { ContentLanguageCode } from "@/lib/content-language"

export type VocabTopicDb = {
  id: string
  curriculumId: string
  slug: string
  title: string
  sortOrder: number
  isPublished: boolean
}

export type VocabLessonDb = {
  id: string
  topicId: string
  curriculumId: string
  languageCode: string
  slug: string
  storyId: string
  title: string
  description: string
  wordCount: number
  sortOrder: number
  nextStoryId: string | null
  nextStoryTitle: string | null
  isPublished: boolean
}

export type VocabWordDb = {
  id: string
  lessonId: string
  slug: string
  term: string
  ipa: string | null
  partOfSpeech: string
  meaningVi: string
  definition: string
  example: string
  exampleVi: string
  collocations: string[]
  distractors: string[]
  sortOrder: number
}

function base(lang: ContentLanguageCode) {
  return `/v1/admin/languages/${lang}/vocab`
}

export async function fetchVocabLevelTree(lang: ContentLanguageCode, level: string) {
  return adminApiRequest<{
    curriculum: { id: string; levelCode: string }
    topics: {
      topic: VocabTopicDb
      lessons: {
        id: string
        storyId: string
        slug: string
        title: string
        description: string
        wordCount: number
        sortOrder: number
        isPublished: boolean
      }[]
    }[]
  }>("GET", `${base(lang)}/${encodeURIComponent(level)}`)
}

export async function fetchVocabLesson(lang: ContentLanguageCode, lessonId: string) {
  return adminApiRequest<{ lesson: VocabLessonDb; words: VocabWordDb[] }>(
    "GET",
    `${base(lang)}/lessons/${encodeURIComponent(lessonId)}`,
  )
}

export async function patchVocabLesson(
  lang: ContentLanguageCode,
  lessonId: string,
  body: Record<string, unknown>,
) {
  return adminApiRequest<{ lesson: VocabLessonDb }>(
    "PATCH",
    `${base(lang)}/lessons/${encodeURIComponent(lessonId)}`,
    body,
  )
}

export async function putVocabWords(
  lang: ContentLanguageCode,
  lessonId: string,
  words: Record<string, unknown>[],
) {
  return adminApiRequest<{ words: VocabWordDb[] }>(
    "PUT",
    `${base(lang)}/lessons/${encodeURIComponent(lessonId)}/words`,
    { words },
  )
}
