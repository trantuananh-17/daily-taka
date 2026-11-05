import { serverFetchJson } from "@/lib/api/server-fetch"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { VocabLevelDetail } from "@/lib/learn/vocab/vocab-api"
import type { VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"

export const VOCAB_SERVER_REVALIDATE_SECONDS = 60

export async function serverGetVocabLevelDetail(
  language: LanguageHubCode,
  level: string,
): Promise<VocabLevelDetail | null> {
  const encodedLevel = encodeURIComponent(level)
  return serverFetchJson<VocabLevelDetail>(
    `/v1/languages/${language}/vocab/${encodedLevel}`,
    { revalidateSeconds: VOCAB_SERVER_REVALIDATE_SECONDS },
  )
}

export async function serverGetVocabLessonStory(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
): Promise<VocabLessonStory | null> {
  const encodedLevel = encodeURIComponent(level)
  return serverFetchJson<VocabLessonStory>(
    `/v1/languages/${language}/vocab/${encodedLevel}/sections/${encodeURIComponent(sectionId)}/lessons/${encodeURIComponent(lessonSlug)}`,
    { revalidateSeconds: VOCAB_SERVER_REVALIDATE_SECONDS },
  )
}
