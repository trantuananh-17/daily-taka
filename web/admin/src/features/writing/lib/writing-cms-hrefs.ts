import type { ContentLanguageCode } from "@/lib/content-language"

function withQuery(path: string, language: ContentLanguageCode, level: string): string {
  const params = new URLSearchParams({ lang: language, level })
  return `${path}?${params.toString()}`
}

export function writingCmsRootHref(language: ContentLanguageCode, level: string): string {
  return withQuery("/writing", language, level)
}

export function writingTopicLessonsHref(
  topicId: string,
  language: ContentLanguageCode,
  level: string,
): string {
  return withQuery(`/writing/topics/${encodeURIComponent(topicId)}`, language, level)
}

export function writingLessonDetailHref(
  topicId: string,
  lessonId: string,
  language: ContentLanguageCode,
  level: string,
): string {
  return withQuery(
    `/writing/topics/${encodeURIComponent(topicId)}/lessons/${encodeURIComponent(lessonId)}`,
    language,
    level,
  )
}
