import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { HandbookCatalog } from "@/features/handbook/handbook-catalog"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { HandbookCollection } from "@/lib/learn/handbook/types/content"
import type { LanguageHubCode } from "@/lib/learn/hub"

const HANDBOOK_TRAIL_LABEL = "Cẩm nang"

type HandbookCatalogPageProps = {
  language: LanguageHubCode
  collection: HandbookCollection
}

export function HandbookCatalogPage({ language, collection }: HandbookCatalogPageProps) {
  return (
    <MarketingPageShell>
      <LanguageHubToolbar language={language} trail={[{ label: HANDBOOK_TRAIL_LABEL }]} />
      <div className={PAGE_CONTAINER_WIDE}>
        <div className={PAGE_CONTENT_PY}>
          <HandbookCatalog language={language} collection={collection} />
        </div>
      </div>
    </MarketingPageShell>
  )
}
