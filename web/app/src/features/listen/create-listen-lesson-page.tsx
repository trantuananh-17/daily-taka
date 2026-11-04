import type { Metadata } from "next"

import { ListenLessonPage } from "@/features/listen/listen-lesson-page"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"
import { fetchListeningSectionLessons } from "@/lib/learn/listening/fetch-listening-section-lessons"
import { getEnShortStoriesAllLessons } from "@/lib/learn/listening/mock/en-short-stories-sections"
import { getJpFolkTalesAllLessons } from "@/lib/learn/listening/mock/jp-folk-tales-sections"
import { getZhShortStoriesAllLessons } from "@/lib/learn/listening/mock/zh-short-stories-sections"

/** Static metadata — dynamic `params` in generateMetadata blocks PPR (`cacheComponents`). */
export function createListenLessonPageMetadata(language: LanguageHubCode): Metadata {
  const hub = LANGUAGE_HUBS[language]
  return {
    title: `Bài nghe | Nghe chép chính tả | ${hub.pageTitle} | ${APP_NAME}`,
    description: `Luyện nghe và chép chính tả theo từng câu — ${hub.breadcrumbLabel}.`,
  }
}

export function createListenLessonPage(language: LanguageHubCode) {
  return function ListenLessonRoute() {
    return <ListenLessonPage language={language} />
  }
}

/** Mock lesson paths — required with nextConfig.cacheComponents. */
export function createListenLessonStaticParams(language: LanguageHubCode) {
  return async function generateStaticParams() {
    if (language === "en") {
      const fromApi = await fetchListeningSectionLessons({
        language: "en",
        categorySlug: "short-stories",
        sectionId: "section-en-short-stories-1",
      }).catch(() => null)
      if (fromApi?.length) {
        return fromApi.map((lesson) => ({
          slug: "short-stories",
          sectionId: lesson.sectionId,
          lessonSlug: lesson.slug,
        }))
      }
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
