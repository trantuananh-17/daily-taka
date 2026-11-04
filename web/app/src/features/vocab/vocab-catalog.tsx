import { VocabLevelCard } from "@/features/vocab/vocab-level-card"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getVocabLanguageMeta, getVocabLevels } from "@/lib/learn/vocab/levels"

import "./vocab-catalog.css"

type VocabCatalogProps = {
  language: LanguageHubCode
}

export function VocabCatalog({ language }: VocabCatalogProps) {
  const levels = getVocabLevels(language)
  const meta = getVocabLanguageMeta(language)

  return (
    <main className="vocab-catalog">
      <div className="vocab-catalog-hero">
        <h1>Chọn trình độ của bạn</h1>
        <p>Học từ mới theo lộ trình: hiểu trong ngữ cảnh, nhận diện, rồi chủ động gợi nhớ.</p>
      </div>
      <div className="vocab-level-grid" data-language={meta.dataLanguage}>
        {levels.map((level) => (
          <VocabLevelCard key={level.level} language={language} level={level} />
        ))}
      </div>
    </main>
  )
}
