import type { LanguageHubCode } from "@/lib/learn/hub"
import { serverGetListeningCategoryDetail } from "@/lib/learn/listening/listening-api-server"
import type { ListeningCategoryDetail } from "@/lib/learn/listening/types"

/** Category + section summaries — GET .../categories/:slug (RSC / metadata; cached). */
export async function getListeningCategoryDetail(
  language: LanguageHubCode,
  slug: string,
): Promise<ListeningCategoryDetail | null> {
  return serverGetListeningCategoryDetail(language, slug)
}
