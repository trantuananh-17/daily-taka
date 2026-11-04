import type { LanguageHubCode } from "@/lib/learn/hub"
import { serverGetListeningCategories } from "@/lib/learn/listening/listening-api-server"
import type { ListeningCategoryListResponse } from "@/lib/learn/listening/types"

const EMPTY_CATALOG: ListeningCategoryListResponse = {
  next: null,
  rows: [],
  version: "1",
  complete: true,
}

/** Catalog list — GET /v1/languages/:code/listening/categories (RSC / metadata; cached). */
export async function getListeningCategories(
  language: LanguageHubCode,
): Promise<ListeningCategoryListResponse> {
  const data = await serverGetListeningCategories(language)
  return data ?? EMPTY_CATALOG
}
