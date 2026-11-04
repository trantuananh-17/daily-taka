import { notFound } from "next/navigation"

import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { DictationPlayer } from "@/features/listen/dictation/dictation-player"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getListeningLessonDetail } from "@/lib/learn/listening/get-listening-lesson-detail"
import { listeningCatalogHref, listeningCategoryHref } from "@/lib/learn/listening/listening-hrefs"

const LISTEN_TRAIL_LABEL = "Nghe chép chính tả"

type ListenLessonPageProps = {
  language: LanguageHubCode
  categorySlug: string
  sectionId: string
  lessonSlug: string
}

export async function ListenLessonPage({
  language,
  categorySlug,
  sectionId,
  lessonSlug,
}: ListenLessonPageProps) {
  const detail = await getListeningLessonDetail(language, categorySlug, sectionId, lessonSlug)
  if (!detail) {
    notFound()
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
