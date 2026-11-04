import {
  createCurriculumLessonPageMetadata,
  createCurriculumLessonStaticParams,
  createCurriculumLevelPageMetadata,
  createCurriculumLevelStaticParams,
} from "@/features/learn/create-curriculum-level-routes"
import { VocabLevelPage } from "@/features/vocab/vocab-level-page"
import { VocabLessonPage } from "@/features/vocab/vocab-lesson-page"
import type { LanguageHubCode } from "@/lib/learn/hub"

type LevelRouteProps = {
  params: Promise<{ level: string }>
}

type LessonRouteProps = {
  params: Promise<{ level: string; sectionId: string; lessonSlug: string }>
}

export function createVocabLevelPage(language: LanguageHubCode) {
  return async function VocabLevelRoute({ params }: LevelRouteProps) {
    const { level } = await params
    return <VocabLevelPage language={language} level={level} />
  }
}

export function createVocabLessonPage(language: LanguageHubCode) {
  return async function VocabLessonRoute({ params }: LessonRouteProps) {
    const { level, sectionId, lessonSlug } = await params
    return (
      <VocabLessonPage
        language={language}
        level={level}
        sectionId={sectionId}
        lessonSlug={lessonSlug}
      />
    )
  }
}

export const createVocabLevelPageMetadata = (language: LanguageHubCode) =>
  createCurriculumLevelPageMetadata(language, "vocab", "Từ vựng")

export const createVocabLevelStaticParams = (language: LanguageHubCode) =>
  createCurriculumLevelStaticParams(language, "vocab")

export const createVocabLessonPageMetadata = (language: LanguageHubCode) =>
  createCurriculumLessonPageMetadata(language, "vocab", "Từ vựng")

export const createVocabLessonStaticParams = (language: LanguageHubCode) =>
  createCurriculumLessonStaticParams(language, "vocab")
