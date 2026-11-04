import type { Metadata } from "next"

import { ListenLessonPage } from "@/features/listen/listen-lesson-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"
import { getListeningLessonDetail } from "@/lib/learn/listening/get-listening-lesson-detail"
import { getEnShortStoriesAllLessons } from "@/lib/learn/listening/mock/en-short-stories-sections"
import { getJpFolkTalesAllLessons } from "@/lib/learn/listening/mock/jp-folk-tales-sections"
import { getZhShortStoriesAllLessons } from "@/lib/learn/listening/mock/zh-short-stories-sections"

type ListenLessonRouteProps = {
  params: Promise<{ slug: string; sectionId: string; lessonSlug: string }>
}

export function createListenLessonPageMetadata(language: LanguageHubCode) {
  return async function generateMetadata({ params }: ListenLessonRouteProps): Promise<Metadata> {
    const { slug, sectionId, lessonSlug } = await params
    const detail = await getListeningLessonDetail(language, slug, sectionId, lessonSlug)
    const hub = LANGUAGE_HUBS[language]

    if (!detail) {
      return { title: `Không tìm thấy | ${APP_NAME}` }
    }

    return {
      title: `${detail.lesson.title} | ${detail.categoryName} | ${hub.pageTitle} | ${APP_NAME}`,
      description: `Luyện nghe chép chính tả: ${detail.lesson.title}.`,
    }
  }
}

export function createListenLessonPage(language: LanguageHubCode) {
  return async function ListenLessonRoute({ params }: ListenLessonRouteProps) {
    const { slug, sectionId, lessonSlug } = await params
    return (
      <ListenLessonPage
        language={language}
        categorySlug={slug}
        sectionId={sectionId}
        lessonSlug={lessonSlug}
      />
    )
  }
}

/** Mock lesson paths — required with nextConfig.cacheComponents. */
export function createListenLessonStaticParams(language: LanguageHubCode) {
  return async function generateStaticParams() {
    if (language === "en") {
      return getEnShortStoriesAllLessons().map((lesson) => ({
        slug: "short-stories",
        sectionId: lesson.sectionId,
        lessonSlug: lesson.slug,
      }))
    }
    if (language === "zh") {
      return getZhShortStoriesAllLessons().map((lesson) => ({
        slug: "short-stories",
        sectionId: lesson.sectionId,
        lessonSlug: lesson.slug,
      }))
    }
    if (language === "jp") {
      return getJpFolkTalesAllLessons().map((lesson) => ({
        slug: "folk-tales",
        sectionId: lesson.sectionId,
        lessonSlug: lesson.slug,
      }))
    }
    return []
  }
}
