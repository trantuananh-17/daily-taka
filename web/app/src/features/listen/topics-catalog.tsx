import { TopicCard } from "@/features/listen/topic-card"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningCategory } from "@/lib/learn/listening/types"

import "./topics-catalog.css"

type TopicsCatalogProps = {
  language: LanguageHubCode
  categories: ListeningCategory[]
  title?: string
  subtitle?: string
}

export function TopicsCatalog({
  language,
  categories,
  title = "Nghe và chép chính tả",
  subtitle = "Chọn một chủ đề phù hợp với mục tiêu và trình độ nghe của bạn.",
}: TopicsCatalogProps) {
  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <section className="topics-catalog language-primary-section" aria-labelledby="topics-title">
      <header className="topics-heading">
        <h1 id="topics-title">{title}</h1>
        <p>{subtitle}</p>
      </header>
      <ul className="topics-grid">
        {sorted.map((category) => (
          <TopicCard key={category.id} category={category} language={language} />
        ))}
      </ul>
    </section>
  )
}
