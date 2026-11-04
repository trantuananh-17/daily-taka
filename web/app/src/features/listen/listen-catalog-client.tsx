"use client"

import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import { TopicsCatalog } from "@/features/listen/topics-catalog"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { useListeningCategoriesQuery } from "@/lib/learn/listening/use-listening-queries"

const LISTEN_TRAIL_LABEL = "Nghe chép chính tả"

type ListenCatalogClientProps = {
  language: LanguageHubCode
}

export function ListenCatalogClient({ language }: ListenCatalogClientProps) {
  const { data, isLoading, isError } = useListeningCategoriesQuery(language)

  return (
    <MarketingPageShell>
      <LanguageHubToolbar language={language} trail={[{ label: LISTEN_TRAIL_LABEL }]} />
      <main className={PAGE_CONTAINER_WIDE}>
        <div className={PAGE_CONTENT_PY}>
          {isLoading ? (
            <p className="font-body text-sm text-[var(--dlx-muted)]">Đang tải chủ đề…</p>
          ) : isError || !data ? (
            <p className="font-body text-sm text-[var(--dlx-muted)]">
              Không tải được danh sách. Chạy API (<code className="text-xs">pnpm dev:api</code>
              ), Docker Postgres và{" "}
              <code className="text-xs">NEXT_PUBLIC_API_URL</code> rồi tải lại trang.
            </p>
          ) : (
            <TopicsCatalog language={language} categories={data.rows} />
          )}
        </div>
      </main>
    </MarketingPageShell>
  )
}
