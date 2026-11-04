"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { VocabLessonHowToDialog } from "@/features/vocab/lesson/vocab-lesson-how-to-dialog"

type VocabLessonFocusBarProps = {
  backHref: string
  title: string
  onBackClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  howToDialog?: ReactNode
}

export function VocabLessonFocusBar({ backHref, title, onBackClick, howToDialog }: VocabLessonFocusBarProps) {
  return (
    <header className="w-full border-b border-[var(--dlx-hairline)] bg-transparent">
      <div className="mx-auto flex w-full max-w-[48rem] items-center gap-3 px-4 py-3 md:px-6">
        <Link
          href={backHref}
          onClick={onBackClick}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 font-body text-sm font-semibold text-[var(--dlx-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--dlx-primary)_8%,#fff)]"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Quay lại
        </Link>
        <p className="m-0 min-w-0 flex-1 truncate font-body text-sm font-medium text-[var(--dlx-muted)]">{title}</p>
        {howToDialog ?? (
          <VocabLessonHowToDialog
            triggerClassName="size-9 shrink-0 rounded-full border-[var(--dlx-hairline)] bg-white shadow-none"
          />
        )}
      </div>
    </header>
  )
}
