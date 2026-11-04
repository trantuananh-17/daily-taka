import {
  createCurriculumLessonPageMetadata,
  createCurriculumLessonStaticParams,
  createCurriculumLevelPageMetadata,
  createCurriculumLevelStaticParams,
} from "@/features/learn/create-curriculum-level-routes"
import { CurriculumLessonPlaceholderPage } from "@/features/learn/curriculum-lesson-placeholder-page"
import { WritingLevelPage } from "@/features/writing/writing-level-page"
import type { LanguageHubCode } from "@/lib/learn/hub"

type LevelRouteProps = {
  params: Promise<{ level: string }>
}

type LessonRouteProps = {
  params: Promise<{ level: string; sectionId: string; lessonSlug: string }>
}

export function createWritingLevelPage(language: LanguageHubCode) {
  return async function WritingLevelRoute({ params }: LevelRouteProps) {
    const { level } = await params
    return <WritingLevelPage language={language} level={level} />
  }
}

export function createWritingLessonPage(language: LanguageHubCode) {
  return async function WritingLessonRoute({ params }: LessonRouteProps) {
    const { level, sectionId, lessonSlug } = await params
    return (
      <CurriculumLessonPlaceholderPage
        language={language}
        module="writing"
        level={level}
        sectionId={sectionId}
        lessonSlug={lessonSlug}
      />
    )
  }
}

export const createWritingLevelPageMetadata = (language: LanguageHubCode) =>
  createCurriculumLevelPageMetadata(language, "writing", "Luyện viết")

export const createWritingLevelStaticParams = (language: LanguageHubCode) =>
  createCurriculumLevelStaticParams(language, "writing")

export const createWritingLessonPageMetadata = (language: LanguageHubCode) =>
  createCurriculumLessonPageMetadata(language, "writing", "Luyện viết")

export const createWritingLessonStaticParams = (language: LanguageHubCode) =>
  createCurriculumLessonStaticParams(language, "writing")
