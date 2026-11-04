import { WritingLevelCard } from "@/features/writing/writing-level-card"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getWritingLanguageMeta, getWritingLevels } from "@/lib/learn/writing/levels"

import "./writing-catalog.css"

type WritingCatalogProps = {
  language: LanguageHubCode
}

export function WritingCatalog({ language }: WritingCatalogProps) {
  const levels = getWritingLevels(language)
  const meta = getWritingLanguageMeta(language)

  return (
    <main className="writing-catalog">
      <div className="writing-catalog-hero">
        <h1>Chọn trình độ của bạn</h1>
        <p>Luyện từng câu, hình thành phản xạ viết chính xác mỗi ngày.</p>
      </div>
      <div className="writing-level-grid" data-language={meta.dataLanguage}>
        {levels.map((level) => (
          <WritingLevelCard key={level.level} language={language} level={level} />
        ))}
      </div>
    </main>
  )
}
