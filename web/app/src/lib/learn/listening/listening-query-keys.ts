import type { LanguageHubCode } from "@/lib/learn/hub"

export const listeningKeys = {
  all: ["listening"] as const,
  categories: (language: LanguageHubCode) =>
    [...listeningKeys.all, "categories", language] as const,
  categoryDetail: (language: LanguageHubCode, categorySlug: string) =>
    [...listeningKeys.all, "category", language, categorySlug] as const,
  sectionLessons: (
    language: LanguageHubCode,
    categorySlug: string,
    sectionId: string,
    level?: string,
  ) =>
    [
      ...listeningKeys.all,
      "section-lessons",
      language,
      categorySlug,
      sectionId,
      level ?? "all",
    ] as const,
  lessonDetail: (
    language: LanguageHubCode,
    categorySlug: string,
    sectionId: string,
    lessonSlug: string,
  ) =>
    [
      ...listeningKeys.all,
      "lesson",
      language,
      categorySlug,
      sectionId,
      lessonSlug,
    ] as const,
  search: (
    language: LanguageHubCode,
    categorySlug: string,
    q: string,
    level: string,
  ) => [...listeningKeys.all, "search", language, categorySlug, q, level] as const,
}
