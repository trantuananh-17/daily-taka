import Link from "next/link"
import { cn } from "cn"

import type { HandbookPostMeta } from "@/lib/learn/handbook/types/content"
import type { LanguageHubCode } from "@/lib/learn/hub"

type HandbookPostCardProps = {
  language: LanguageHubCode
  post: HandbookPostMeta
  featured?: boolean
}

export function HandbookPostCard({ language, post, featured }: HandbookPostCardProps) {
  const indexLabel = String(post.sortOrder).padStart(2, "0")
  const meta = `${post.category} · ${post.readingTimeMinutes} PHÚT ĐỌC`
  const href = `/${language}/handbook/${post.slug}`

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-[var(--dlx-hairline)] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6",
        featured && "md:p-8",
      )}
    >
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={cn(
            "font-heading text-sm font-bold tabular-nums text-[rgb(160,160,152)]",
            featured && "text-base",
          )}
        >
          {indexLabel}
        </span>
        <span className="font-heading text-[10px] font-bold uppercase tracking-wide text-emerald-700 sm:text-[11px]">
          {meta}
        </span>
      </div>
      <h2
        className={cn(
          "font-heading text-lg font-bold leading-snug text-[var(--dlx-ink)] line-clamp-2",
          featured && "text-xl sm:text-2xl",
        )}
      >
        <Link href={href} className="no-underline hover:text-[var(--dlx-link)]">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-[var(--dlx-muted)] line-clamp-3 sm:text-[15px]">
        {post.excerpt}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex w-fit font-heading text-sm font-bold text-[var(--dlx-link)] no-underline hover:underline"
      >
        Đọc cẩm nang →
      </Link>
    </article>
  )
}
