import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import { VocabCatalog } from "@/features/vocab/vocab-catalog"
import type { LanguageHubCode } from "@/lib/learn/hub"

const VOCAB_TRAIL_LABEL = "Học từ vựng"

type VocabCatalogPageProps = {
  language: LanguageHubCode
}

export function VocabCatalogPage({ language }: VocabCatalogPageProps) {
  return (
    <MarketingPageShell>
      <LanguageHubToolbar language={language} trail={[{ label: VOCAB_TRAIL_LABEL }]} />
      <div className={PAGE_CONTAINER_WIDE}>
        <div className={PAGE_CONTENT_PY}>
          <VocabCatalog language={language} />
        </div>
      </div>
    </MarketingPageShell>
  )
}
