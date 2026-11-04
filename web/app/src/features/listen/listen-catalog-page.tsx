import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import { TopicsCatalog } from "@/features/listen/topics-catalog"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getListeningCategories } from "@/lib/learn/listening/get-listening-categories"

const LISTEN_TRAIL_LABEL = "Nghe chép chính tả"

type ListenCatalogPageProps = {
  language: LanguageHubCode
}

export async function ListenCatalogPage({ language }: ListenCatalogPageProps) {
  const { rows } = await getListeningCategories(language)

  return (
    <MarketingPageShell>
      <LanguageHubToolbar language={language} trail={[{ label: LISTEN_TRAIL_LABEL }]} />
      <main className={PAGE_CONTAINER_WIDE}>
        <div className={PAGE_CONTENT_PY}>
          <TopicsCatalog language={language} categories={rows} />
        </div>
      </main>
    </MarketingPageShell>
  )
}
