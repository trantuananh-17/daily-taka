import type { ListenLanguageCode } from "@/features/listen/lib/listen-language"

function withLang(path: string, language: ListenLanguageCode): string {
  return `${path}?lang=${language}`
}

export function listenCmsRootHref(language: ListenLanguageCode): string {
  return withLang("/listen", language)
}

export function listenCategorySectionsHref(
  categoryId: string,
  language: ListenLanguageCode,
): string {
  return withLang(`/listen/categories/${encodeURIComponent(categoryId)}`, language)
}

export function listenSectionLessonsHref(
  sectionId: string,
  language: ListenLanguageCode,
): string {
  return withLang(`/listen/sections/${encodeURIComponent(sectionId)}`, language)
}

export function listenLessonDetailHref(
  sectionId: string,
  lessonId: string,
  language: ListenLanguageCode,
): string {
  return withLang(
    `/listen/sections/${encodeURIComponent(sectionId)}/lessons/${encodeURIComponent(lessonId)}`,
    language,
  )
}
