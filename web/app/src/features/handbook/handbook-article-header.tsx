import { Calendar, Clock } from "lucide-react"

import { formatHandbookPublishedAt } from "@/lib/learn/handbook/format-handbook-date"
import type { HandbookPost } from "@/lib/learn/handbook/types/content"

type HandbookArticleHeaderProps = {
  post: HandbookPost
}

export function HandbookArticleHeader({ post }: HandbookArticleHeaderProps) {
  const publishedLabel = formatHandbookPublishedAt(post.publishedAt)

  return (
    <header className="border-b border-[var(--dlx-hairline)] pb-8">
      <p className="font-heading text-[11px] font-bold uppercase tracking-wide text-emerald-700 sm:text-xs">
        {post.category}
      </p>
      <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-[var(--dlx-ink)] sm:text-4xl">
        {post.title}
      </h1>
      {post.summary ? (
        <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-[var(--dlx-muted)] sm:text-[17px]">
          {post.summary}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-sm text-[rgb(160,160,152)]">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          {post.readingTimeMinutes} phút đọc
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          Xuất bản {publishedLabel}
        </span>
      </div>
    </header>
  )
}
