import type { LanguageHubCode } from "@/lib/learn/hub"

export function listeningCatalogHref(language: LanguageHubCode): string {
  return `/${language}/listen`
}

export function listeningCategoryHref(language: LanguageHubCode, slug: string): string {
  return `${listeningCatalogHref(language)}/${slug}`
}

export function listeningLessonHref(
  language: LanguageHubCode,
  categorySlug: string,
  sectionId: string,
  lessonSlug: string,
): string {
  return `${listeningCategoryHref(language, categorySlug)}/${sectionId}/${lessonSlug}`
}
