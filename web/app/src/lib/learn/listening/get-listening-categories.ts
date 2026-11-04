import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningCategoryListResponse } from "@/lib/learn/listening/types"

import enMock from "./mock/en-categories.json"
import jpMock from "./mock/jp-categories.json"
import zhMock from "./mock/zh-categories.json"

const MOCKS: Record<LanguageHubCode, ListeningCategoryListResponse> = {
  en: enMock as ListeningCategoryListResponse,
  zh: zhMock as ListeningCategoryListResponse,
  jp: jpMock as ListeningCategoryListResponse,
}

/** Mock until GET /languages/:code/listening/categories is wired. */
export async function getListeningCategories(
  language: LanguageHubCode,
): Promise<ListeningCategoryListResponse> {
  return MOCKS[language]
}

