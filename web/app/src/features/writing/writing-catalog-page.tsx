import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import { WritingCatalog } from "@/features/writing/writing-catalog"
import type { LanguageHubCode } from "@/lib/learn/hub"

const WRITING_TRAIL_LABEL = "Luyện viết"

type WritingCatalogPageProps = {
  language: LanguageHubCode
}

export function WritingCatalogPage({ language }: WritingCatalogPageProps) {
  return (
    <MarketingPageShell>
      <LanguageHubToolbar language={language} trail={[{ label: WRITING_TRAIL_LABEL }]} />
      <div className={PAGE_CONTAINER_WIDE}>
        <div className={PAGE_CONTENT_PY}>
          <WritingCatalog language={language} />
        </div>
      </div>
    </MarketingPageShell>
  )
}
