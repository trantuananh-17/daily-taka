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
import { getWritingLanguageMeta, getWritingLevels } from "@/lib/learn/writing/levels"
import { writingCatalogHref } from "@/lib/learn/writing/writing-hrefs"

const WRITING_TRAIL_LABEL = "Luyện viết"

type WritingLevelPageProps = {
  language: LanguageHubCode
  level: string
}

export async function WritingLevelPage({ language, level }: WritingLevelPageProps) {
  const decodedLevel = decodeURIComponent(level)
  const allowed = getWritingLevels(language).some((row) => row.level === decodedLevel)
  if (!allowed) notFound()

  const detail = await getCurriculumLevelDetail(language, "writing", decodedLevel)
  if (!detail) notFound()

  const meta = getWritingLanguageMeta(language)

  return (
    <MarketingPageShell>
      <LanguageHubToolbar
        language={language}
        trail={[
          { label: WRITING_TRAIL_LABEL, href: writingCatalogHref(language) },
          { label: decodedLevel },
        ]}
      />
      <main className={`${PAGE_CONTAINER_WIDE} flex flex-1 flex-col`}>
        <div className={`${PAGE_CONTENT_PY} flex flex-1 flex-col`}>
          <LevelTopicAccordion
            language={language}
            module="writing"
            level={decodedLevel}
            kicker="Luyện viết"
            title={`${decodedLevel} · ${meta.footerLanguage}`}
            subtitle="Chọn một chủ đề, sau đó mở bài học để luyện viết chính xác từng câu."
            sections={detail.sections}
          />
        </div>
      </main>
    </MarketingPageShell>
  )
}
