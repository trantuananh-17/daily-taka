import type { LanguageHubCode } from "@/lib/learn/hub"
import { serverGetListeningSectionLessons } from "@/lib/learn/listening/listening-api-server"
import type { ListeningLesson } from "@/lib/learn/listening/types"

type FetchSectionLessonsParams = {
  language: LanguageHubCode
  categorySlug: string
  sectionId: string
  level?: string
}

/** Section lesson list — GET .../sections/:sectionId/lessons (RSC / static params; cached). */
export async function fetchListeningSectionLessons({
  language,
  categorySlug,
  sectionId,
  level,
}: FetchSectionLessonsParams): Promise<ListeningLesson[]> {
  const rows = await serverGetListeningSectionLessons(language, categorySlug, sectionId, level)
  return rows ?? []
}
