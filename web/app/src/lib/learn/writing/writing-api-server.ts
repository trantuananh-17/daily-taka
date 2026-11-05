import { serverFetchJson } from "@/lib/api/server-fetch"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { WritingLevelDetail } from "@/lib/learn/writing/writing-api"
import type { WritingLesson } from "@/lib/learn/writing/types/lesson"

export const WRITING_SERVER_REVALIDATE_SECONDS = 60

export async function serverGetWritingLesson(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
): Promise<WritingLesson | null> {
  const encodedLevel = encodeURIComponent(level)
  return serverFetchJson<WritingLesson>(
    `/v1/languages/${language}/writing/${encodedLevel}/sections/${encodeURIComponent(sectionId)}/lessons/${encodeURIComponent(lessonSlug)}`,
    { revalidateSeconds: WRITING_SERVER_REVALIDATE_SECONDS },
  )
}

export async function serverGetWritingLevelDetail(
  language: LanguageHubCode,
  level: string,
): Promise<WritingLevelDetail | null> {
  const encodedLevel = encodeURIComponent(level)
  return serverFetchJson<WritingLevelDetail>(
    `/v1/languages/${language}/writing/${encodedLevel}`,
    { revalidateSeconds: WRITING_SERVER_REVALIDATE_SECONDS },
  )
}
