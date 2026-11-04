import type { LanguageHubCode } from "@/lib/learn/hub"

export function writingCatalogHref(language: LanguageHubCode): string {
  return `/${language}/write`
}

export function writingLevelHref(language: LanguageHubCode, level: string): string {
  return `/${language}/write/${encodeURIComponent(level)}`
}

export function writingLessonHref(
  language: LanguageHubCode,
  level: string,
  sectionId: string,
  lessonSlug: string,
): string {
  return `/${language}/write/${encodeURIComponent(level)}/${encodeURIComponent(sectionId)}/${encodeURIComponent(lessonSlug)}`
}
