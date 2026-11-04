import type { LanguageHubCode } from "@/lib/learn/hub"
import type { DictationLessonDetail } from "@/lib/learn/listening/types"

import { getListeningCategories } from "./get-listening-categories"
import { resolveListeningLessonDetail } from "./resolve-listening-lesson-detail"

export async function getListeningLessonDetail(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  lessonSlug: string,
): Promise<DictationLessonDetail | null> {
  const { rows } = await getListeningCategories(language)
  const category = rows.find((row) => row.slug === categorySlug)
  if (!category) return null

  return resolveListeningLessonDetail(
    language,
    categorySlug,
    sectionId,
    lessonSlug,
    category.name,
  )
}
