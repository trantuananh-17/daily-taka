import { notFound } from "next/navigation"

import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { SectionAccordion } from "@/features/listen/category/section-accordion"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getListeningCategoryDetail } from "@/lib/learn/listening/get-listening-category-detail"
import { listeningCatalogHref } from "@/lib/learn/listening/listening-hrefs"

const LISTEN_TRAIL_LABEL = "Nghe chép chính tả"

type ListenCategoryPageProps = {
  language: LanguageHubCode
  slug: string
}

export async function ListenCategoryPage({ language, slug }: ListenCategoryPageProps) {
  const detail = await getListeningCategoryDetail(language, slug)
  if (!detail) {
    notFound()
  }

  const { category, sections } = detail

  return (
    <MarketingPageShell>
      <LanguageHubToolbar
        language={language}
        trail={[
          { label: LISTEN_TRAIL_LABEL, href: listeningCatalogHref(language) },
          { label: category.name },
        ]}
      />
      <main className={`${PAGE_CONTAINER_WIDE} flex flex-1 flex-col`}>
        <div className={`${PAGE_CONTENT_PY} flex flex-1 flex-col`}>
          {sections.length > 0 ? (
            <SectionAccordion language={language} category={category} sections={sections} />
          ) : (
            <p className="text-[var(--dlx-body)]">Nội dung chủ đề này sẽ sớm được cập nhật.</p>
          )}
        </div>
      </main>
    </MarketingPageShell>
  )
}
