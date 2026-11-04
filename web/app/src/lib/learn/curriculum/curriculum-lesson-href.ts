import type { CurriculumModule } from "@/lib/learn/curriculum/types"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { vocabLessonHref } from "@/lib/learn/vocab/vocab-hrefs"
import { writingLessonHref } from "@/lib/learn/writing/writing-hrefs"

export function curriculumLessonHref(
  language: LanguageHubCode,
  module: CurriculumModule,
  level: string,
  sectionId: string,
  lessonSlug: string,
): string {
  if (module === "vocab") {
    return vocabLessonHref(language, level, sectionId, lessonSlug)
  }
  return writingLessonHref(language, level, sectionId, lessonSlug)
}
