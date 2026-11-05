import { notFound } from "next/navigation"

import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { LevelTopicAccordion } from "@/features/learn/level-curriculum/level-topic-accordion"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getCurriculumLevelDetail } from "@/lib/learn/curriculum/get-curriculum-level-detail"
import { getVocabLanguageMeta, getVocabLevels } from "@/lib/learn/vocab/levels"
import { vocabCatalogHref } from "@/lib/learn/vocab/vocab-hrefs"

const VOCAB_TRAIL_LABEL = "Từ vựng"

type VocabLevelPageProps = {
  language: LanguageHubCode
  level: string
}

export async function VocabLevelPage({ language, level }: VocabLevelPageProps) {
  const decodedLevel = decodeURIComponent(level)
  const allowed = getVocabLevels(language).some((row) => row.level === decodedLevel)
  if (!allowed) notFound()

  const detail = await getCurriculumLevelDetail(language, "vocab", decodedLevel)
  if (!detail) notFound()

  const meta = getVocabLanguageMeta(language)

  return (
    <MarketingPageShell>
      <LanguageHubToolbar
        language={language}
        trail={[
          { label: VOCAB_TRAIL_LABEL, href: vocabCatalogHref(language) },
          { label: decodedLevel },
        ]}
      />
      <main className={`${PAGE_CONTAINER_WIDE} flex flex-1 flex-col`}>
        <div className={`${PAGE_CONTENT_PY} flex flex-1 flex-col`}>
          <LevelTopicAccordion
            language={language}
            module="vocab"
            level={decodedLevel}
            kicker={VOCAB_TRAIL_LABEL}
            title={`${decodedLevel} · ${meta.footerLanguage}`}
            subtitle="Chọn chủ đề và một bài ngắn để bắt đầu."
            sections={detail.sections}
          />
        </div>
      </main>
    </MarketingPageShell>
  )
}
