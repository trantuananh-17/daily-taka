import {
  MarketingPageShell,
  PAGE_CONTAINER,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { EnglishFeatureGrid } from "@/features/english/english-feature-grid"
import { EnglishHubToolbar } from "@/features/english/english-hub-toolbar"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

type LanguageHubPageProps = {
  language: LanguageHubCode
}

export function LanguageHubPage({ language }: LanguageHubPageProps) {
  const hub = LANGUAGE_HUBS[language]

  return (
    <MarketingPageShell>
      <EnglishHubToolbar language={language} />
      <main className={PAGE_CONTAINER}>
        <div className={PAGE_CONTENT_PY}>
          <header className="mx-auto mb-10 max-w-[720px] text-center md:mb-12">
            <h1 className="font-heading text-[var(--dlx-h2-size)] font-extrabold leading-[var(--dlx-h2-leading)] text-[var(--dlx-ink)]">
              {hub.pageTitle}
            </h1>
            <p className="dlx-lead mx-auto mt-4 max-w-[640px] text-center">
              Bạn muốn luyện kỹ năng nào hôm nay? Chọn một tính năng để bắt đầu.
            </p>
          </header>
          <EnglishFeatureGrid language={language} />
        </div>
      </main>
    </MarketingPageShell>
  )
}

export function EnglishHubPage() {
  return <LanguageHubPage language="en" />
}
