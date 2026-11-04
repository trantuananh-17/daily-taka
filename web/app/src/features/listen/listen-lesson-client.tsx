"use client"

import { notFound, useParams } from "next/navigation"

import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { DictationPlayer } from "@/features/listen/dictation/dictation-player"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { listeningCatalogHref, listeningCategoryHref } from "@/lib/learn/listening/listening-hrefs"
import { useListeningLessonDetailQuery } from "@/lib/learn/listening/use-listening-queries"

const LISTEN_TRAIL_LABEL = "Nghe chép chính tả"

type ListenLessonClientProps = {
  language: LanguageHubCode
}

type ListenLessonRouteParams = {
  slug: string
  sectionId: string
  lessonSlug: string
}

export function ListenLessonClient({ language }: ListenLessonClientProps) {
  const params = useParams<ListenLessonRouteParams>()
  const categorySlug = params.slug
  const sectionId = params.sectionId
  const lessonSlug = params.lessonSlug
  if (!categorySlug || !sectionId || !lessonSlug) notFound()

  const { data: detail, isLoading, isError } = useListeningLessonDetailQuery(
    language,
    categorySlug,
    sectionId,
    lessonSlug,
  )

  if (!isLoading && (isError || !detail)) {
    notFound()
  }

  if (isLoading || !detail) {
    return (
      <MarketingPageShell>
        <LanguageHubToolbar language={language} trail={[{ label: LISTEN_TRAIL_LABEL }]} />
        <main className={`${PAGE_CONTAINER_WIDE} flex flex-1 flex-col`}>
          <div className={`${PAGE_CONTENT_PY} font-body text-sm text-[var(--dlx-muted)]`}>
            Đang tải bài học…
          </div>
        </main>
      </MarketingPageShell>
    )
  }

  return (
    <MarketingPageShell>
      <LanguageHubToolbar
        language={language}
        trail={[
          { label: LISTEN_TRAIL_LABEL, href: listeningCatalogHref(language) },
          { label: detail.categoryName, href: listeningCategoryHref(language, categorySlug) },
        ]}
      />
      <main className={`${PAGE_CONTAINER_WIDE} flex flex-1 flex-col`}>
        <div className={`${PAGE_CONTENT_PY} flex flex-1 flex-col`}>
          <DictationPlayer language={language} detail={detail} />
        </div>
      </main>
    </MarketingPageShell>
  )
}
