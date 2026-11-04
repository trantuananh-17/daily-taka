import Link from "next/link"
import { notFound } from "next/navigation"

import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  buildLevelSectionLessons,
  buildLevelSectionSummaries,
} from "@/lib/learn/curriculum/build-level-sections"
import { getLevelTopicSeeds } from "@/lib/learn/curriculum/level-topic-seeds"
import type { CurriculumModule } from "@/lib/learn/curriculum/types"
import { getVocabLevels } from "@/lib/learn/vocab/levels"
import { vocabCatalogHref, vocabLevelHref } from "@/lib/learn/vocab/vocab-hrefs"
import { getWritingLevels } from "@/lib/learn/writing/levels"
import { writingCatalogHref, writingLevelHref } from "@/lib/learn/writing/writing-hrefs"

type CurriculumLessonPlaceholderPageProps = {
  language: LanguageHubCode
  module: CurriculumModule
  level: string
  sectionId: string
  lessonSlug: string
}

export async function CurriculumLessonPlaceholderPage({
  language,
  module,
  level,
  sectionId,
  lessonSlug,
}: CurriculumLessonPlaceholderPageProps) {
  const decodedLevel = decodeURIComponent(level)
  const allowedLevels =
    module === "vocab" ? getVocabLevels(language) : getWritingLevels(language)
  if (!allowedLevels.some((row) => row.level === decodedLevel)) notFound()

  const topics = getLevelTopicSeeds(language, module, decodedLevel)
  const sections = buildLevelSectionSummaries({
    module,
    language,
    level: decodedLevel,
    topics,
  })
  const lessons = buildLevelSectionLessons(sections, sectionId, decodedLevel, module)
  const lesson = lessons.find((row) => row.slug === lessonSlug)
  if (!lesson) notFound()

  const section = sections.find((row) => row.id === sectionId)
  const catalogHref = module === "vocab" ? vocabCatalogHref(language) : writingCatalogHref(language)
  const levelHref =
    module === "vocab"
      ? vocabLevelHref(language, decodedLevel)
      : writingLevelHref(language, decodedLevel)
  const featureLabel = module === "vocab" ? "Từ vựng" : "Luyện viết"

  return (
    <MarketingPageShell>
      <LanguageHubToolbar
        language={language}
        trail={[
          { label: featureLabel, href: catalogHref },
          { label: decodedLevel, href: levelHref },
          { label: section?.title ?? "Chủ đề" },
        ]}
      />
      <main className={PAGE_CONTAINER_WIDE}>
        <div className={`${PAGE_CONTENT_PY} max-w-2xl`}>
          <h1 className="m-0 font-heading text-2xl font-extrabold text-[var(--dlx-ink)]">{lesson.title}</h1>
          <p className="mt-3 font-body text-sm text-[var(--dlx-body)]">
            Nội dung bài học (story) sẽ được nối API — mock routing đã sẵn sàng.
          </p>
          <Link href={levelHref} className="mt-6 inline-block font-body text-sm font-semibold text-[var(--dlx-link)]">
            ← Quay lại {decodedLevel}
          </Link>
        </div>
      </main>
    </MarketingPageShell>
  )
}
