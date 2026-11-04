import type { LanguageHubCode } from "@/lib/learn/hub"

export function vocabCatalogHref(language: LanguageHubCode): string {
  return `/${language}/vocab`
}

export function vocabLevelHref(language: LanguageHubCode, level: string): string {
  return `/${language}/vocab/${encodeURIComponent(level)}`
}

export function vocabLessonHref(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
): string {
  return `/${language}/vocab/${encodeURIComponent(level)}/${encodeURIComponent(sectionId)}/${encodeURIComponent(lessonSlug)}`
}
