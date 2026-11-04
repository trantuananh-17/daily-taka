import { WritingLevelCard } from "@/features/writing/writing-level-card"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getWritingLanguageMeta, getWritingLevels } from "@/lib/learn/writing/levels"

type WritingCatalogProps = {
  language: LanguageHubCode
}

export function WritingCatalog({ language }: WritingCatalogProps) {
  const levels = getWritingLevels(language)
  const meta = getWritingLanguageMeta(language)

  return (
    <main>
      <div className="mb-6">
        <h1 className="m-0 font-heading text-[length:var(--dlx-h3-size)] leading-[var(--dlx-h3-leading)] font-extrabold text-[var(--dlx-ink)]">
          Chọn trình độ của bạn
        </h1>
        <p className="mt-2.5 max-w-2xl font-body text-[length:var(--dlx-text-body-size)] leading-[var(--dlx-text-body-leading)] text-[var(--dlx-body)]">
          Luyện từng câu, hình thành phản xạ viết chính xác mỗi ngày.
        </p>
      </div>
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[1.125rem] lg:grid-cols-3 lg:gap-5"
        data-language={meta.dataLanguage}
      >
        {levels.map((level) => (
          <WritingLevelCard key={level.level} language={language} level={level} />
        ))}
      </div>
    </main>
  )
}
