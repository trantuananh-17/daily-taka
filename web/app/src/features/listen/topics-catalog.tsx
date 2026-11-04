import { TopicCard } from "@/features/listen/topic-card"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningCategory } from "@/lib/learn/listening/types"

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
    <section aria-labelledby="topics-title">
      <header className="mb-6">
        <h1
          id="topics-title"
          className="m-0 font-heading text-[length:var(--dlx-h3-size)] leading-[var(--dlx-h3-leading)] font-extrabold text-[var(--dlx-ink)]"
        >
          {title}
        </h1>
        <p className="mt-2.5 max-w-2xl font-body text-[length:var(--dlx-text-body-size)] leading-[var(--dlx-text-body-leading)] text-[var(--dlx-body)]">
          {subtitle}
        </p>
      </header>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 lg:gap-4">
        {sorted.map((category) => (
          <TopicCard key={category.id} category={category} language={language} />
        ))}
      </ul>
    </section>
  )
}
