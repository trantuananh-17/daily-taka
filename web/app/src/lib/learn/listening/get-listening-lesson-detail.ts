import type { LanguageHubCode } from "@/lib/learn/hub"
import { serverGetListeningLessonDetail } from "@/lib/learn/listening/listening-api-server"
import type { DictationLessonDetail } from "@/lib/learn/listening/types"

/** Lesson player payload — GET .../lessons/:lessonSlug (RSC / metadata; cached). */
export async function getListeningLessonDetail(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  lessonSlug: string,
): Promise<DictationLessonDetail | null> {
  return serverGetListeningLessonDetail(language, categorySlug, sectionId, lessonSlug)
}
