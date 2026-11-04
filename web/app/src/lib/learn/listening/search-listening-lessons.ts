import type { LanguageHubCode } from "@/lib/learn/hub"
import { apiSearchListeningLessons } from "@/lib/learn/listening/listening-api"
import type { ListeningLessonSearchResponse } from "@/lib/learn/listening/types"

type SearchListeningLessonsParams = {
  language: LanguageHubCode
  categorySlug: string
  q: string
  level: string
}

/** In-category search — GET .../lessons/search */
export async function searchListeningLessons(
  params: SearchListeningLessonsParams,
): Promise<ListeningLessonSearchResponse> {
  return apiSearchListeningLessons(
    params.language,
    params.categorySlug,
    params.q,
    params.level,
  )
}
