import { VocabLevelCard } from "@/features/vocab/vocab-level-card"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getVocabLanguageMeta, getVocabLevels } from "@/lib/learn/vocab/levels"

type VocabCatalogProps = {
  language: LanguageHubCode
}

export function VocabCatalog({ language }: VocabCatalogProps) {
  const levels = getVocabLevels(language)
  const meta = getVocabLanguageMeta(language)

  return (
    <main>
      <div className="mb-6">
        <h1 className="m-0 font-heading text-[length:var(--dlx-h3-size)] leading-[var(--dlx-h3-leading)] font-extrabold text-[var(--dlx-ink)]">
          Chọn trình độ của bạn
        </h1>
        <p className="mt-2.5 max-w-2xl font-body text-[length:var(--dlx-text-body-size)] leading-[var(--dlx-text-body-leading)] text-[var(--dlx-body)]">
          Học từ mới theo lộ trình: hiểu trong ngữ cảnh, nhận diện, rồi chủ động gợi nhớ.
        </p>
      </div>
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[1.125rem] lg:grid-cols-3 lg:gap-5"
        data-language={meta.dataLanguage}
      >
        {levels.map((level) => (
          <VocabLevelCard key={level.level} language={language} level={level} />
        ))}
      </div>
    </main>
  )
}
