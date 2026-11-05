import type { ContentLanguageCode } from "@/lib/content-language"

function withQuery(path: string, language: ContentLanguageCode, level: string): string {
  const params = new URLSearchParams({ lang: language, level })
  return `${path}?${params.toString()}`
}

export function vocabCmsRootHref(language: ContentLanguageCode, level: string): string {
  return withQuery("/vocab", language, level)
}

export function vocabTopicLessonsHref(
  topicId: string,
  language: ContentLanguageCode,
  level: string,
): string {
  return withQuery(`/vocab/topics/${encodeURIComponent(topicId)}`, language, level)
}

export function vocabLessonDetailHref(
  topicId: string,
  lessonId: string,
  language: ContentLanguageCode,
  level: string,
): string {
  return withQuery(
    `/vocab/topics/${encodeURIComponent(topicId)}/lessons/${encodeURIComponent(lessonId)}`,
    language,
    level,
  )
}
