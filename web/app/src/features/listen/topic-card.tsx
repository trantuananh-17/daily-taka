import Link from "next/link"
import { ArrowRight, Headphones } from "lucide-react"

import { LocaleTopicCover } from "@/features/listen/covers/locale-topic-cover"
import { formatLevelRange } from "@/lib/learn/listening/format-levels"
import { listeningCategoryHref } from "@/lib/learn/listening/listening-hrefs"
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
        href={href}
        aria-label={`Mở chủ đề: ${category.name}`}
        className="flex min-h-full items-stretch gap-3 rounded-2xl border border-[var(--dlx-hairline)] bg-white px-3.5 py-3.5 text-inherit no-underline shadow-[rgba(35,58,44,0.04)_0_2px_8px] transition-[box-shadow,transform,border-color] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--dlx-hairline)_70%,var(--dlx-link))] hover:shadow-[rgba(32,55,43,0.09)_0_10px_24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dlx-primary)]"
      >
        <LocaleTopicCover cover={category.cover} />
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-center justify-between gap-2">
            <h2 className="m-0 font-heading text-[17px] font-bold leading-[1.35] text-[var(--dlx-ink)]">
              {category.name}
            </h2>
            <ArrowRight
              className="size-[18px] shrink-0 text-[var(--dlx-link)] opacity-85"
              strokeWidth={2}
              aria-hidden
            />
          </span>
          <p className="m-0 flex-1 font-body text-xs leading-[1.65] text-[var(--dlx-body)]">
            {description}
          </p>
          <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-xs leading-snug text-[var(--dlx-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <b className="mr-1 font-bold text-[var(--dlx-ink)]">Trình độ</b>
              {levelLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Headphones width={14} height={14} strokeWidth={2} aria-hidden />
              <b className="font-bold text-[var(--dlx-ink)]">{category.lessonCount}</b> bài học
            </span>
          </span>
        </span>
      </Link>
    </li>
  )
}
