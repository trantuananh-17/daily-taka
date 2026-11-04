import Link from "next/link"
import { ArrowRight, Headphones } from "lucide-react"

import { LocaleTopicCover } from "@/features/listen/covers/locale-topic-cover"
import { formatLevelRange } from "@/lib/learn/listening/format-levels"
import { listeningCategoryHref } from "@/lib/learn/listening/get-listening-categories"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningCategory } from "@/lib/learn/listening/types"

type TopicCardProps = {
  category: ListeningCategory
  language: LanguageHubCode
}

export function TopicCard({ category, language }: TopicCardProps) {
  const href = listeningCategoryHref(language, category.slug)
  const description = category.description ?? category.descriptionVi ?? ""
  const levelLabel = formatLevelRange(category.levels)

  return (
    <li>
      <Link
        className="topic-card"
        href={href}
        aria-label={`Mở chủ đề: ${category.name}`}
      >
        <LocaleTopicCover cover={category.cover} />
        <span className="topic-card-body">
          <span className="topic-title-row">
            <h2>{category.name}</h2>
            <ArrowRight className="topic-card-arrow" width={18} height={18} strokeWidth={2} aria-hidden />
          </span>
          <p>{description}</p>
          <span className="topic-meta">
            <span>
              <b>Trình độ</b>
              {levelLabel}
            </span>
            <span>
              <Headphones width={14} height={14} strokeWidth={2} aria-hidden />
              <b>{category.lessonCount}</b> bài học
            </span>
          </span>
        </span>
      </Link>
    </li>
  )
}
