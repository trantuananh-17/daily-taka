import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

import { listeningLessonHref } from "@/lib/learn/listening/listening-hrefs"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningLesson } from "@/lib/learn/listening/types"

type LessonCardProps = {
  lesson: ListeningLesson
  language: LanguageHubCode
  categorySlug: string
}

export function LessonCard({ lesson, language, categorySlug }: LessonCardProps) {
  const href = listeningLessonHref(language, categorySlug, lesson.sectionId, lesson.slug)

  return (
    <li>
      <Link
        href={href}
        aria-label={`Mở bài: ${lesson.title}`}
        className="flex min-h-full items-center gap-2.5 rounded-[10px] border border-[color-mix(in_srgb,var(--dlx-hairline)_90%,#fff)] bg-white px-3 py-2.5 text-inherit no-underline transition-[border-color,box-shadow] hover:border-[color-mix(in_srgb,var(--dlx-hairline)_50%,var(--dlx-link))] hover:shadow-[rgba(32,55,43,0.06)_0_4px_12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dlx-primary)]"
      >
        <span className="w-7 shrink-0 font-body text-xs font-semibold text-[var(--dlx-muted)]">
          {String(lesson.index).padStart(2, "0")}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-heading text-sm font-bold leading-snug text-[#2b5a9e]">
            {lesson.title}
          </span>
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-[11px] text-[var(--dlx-muted)]">
            <span>{lesson.sentenceCount} câu</span>
            <span>Trình độ: {lesson.level}</span>
            <span
              className="inline-flex items-center gap-0.5 text-[var(--dlx-accent-2)]"
              aria-label={`${lesson.stars} sao`}
            >
              <Star className="size-3 fill-current stroke-current" strokeWidth={2} aria-hidden />
              {lesson.stars}
            </span>
          </span>
        </span>
        <ArrowRight
          className="size-[18px] shrink-0 opacity-65 text-[var(--dlx-muted)]"
          strokeWidth={2}
          aria-hidden
        />
      </Link>
    </li>
  )
}
