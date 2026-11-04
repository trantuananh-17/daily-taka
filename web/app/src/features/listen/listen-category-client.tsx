"use client"

import { notFound, useParams } from "next/navigation"

import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { SectionAccordion } from "@/features/listen/category/section-accordion"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { listeningCatalogHref } from "@/lib/learn/listening/listening-hrefs"
import { useListeningCategoryDetailQuery } from "@/lib/learn/listening/use-listening-queries"

const LISTEN_TRAIL_LABEL = "Nghe chép chính tả"

type ListenCategoryClientProps = {
  language: LanguageHubCode
}

export function ListenCategoryClient({ language }: ListenCategoryClientProps) {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  if (!slug) notFound()

  const { data, isLoading, isError } = useListeningCategoryDetailQuery(language, slug)

  if (!isLoading && (isError || !data)) {
    notFound()
  }

  if (isLoading || !data) {
    return (
      <MarketingPageShell>
        <LanguageHubToolbar
          language={language}
          trail={[
            { label: LISTEN_TRAIL_LABEL, href: listeningCatalogHref(language) },
            { label: "…" },
          ]}
        />
        <main className={`${PAGE_CONTAINER_WIDE} flex flex-1 flex-col`}>
          <div className={`${PAGE_CONTENT_PY} font-body text-sm text-[var(--dlx-muted)]`}>
            Đang tải chủ đề…
          </div>
        </main>
      </MarketingPageShell>
    )
  }

  const { category, sections } = data

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
