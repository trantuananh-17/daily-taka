"use client"

import { useCallback } from "react"

import { SiteHeader } from "@/components/layout/site-header"
import { PAGE_CONTAINER_WIDE, PAGE_CONTENT_PY } from "@/components/layout/marketing-page-shell"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import { VocabLessonFocusBar } from "@/features/vocab/lesson/vocab-lesson-focus-bar"
import { WritingLessonPlayer } from "@/features/writing/lesson/writing-lesson-player"
import { WritingLessonShortcutsDialog } from "@/features/writing/lesson/writing-lesson-shortcuts-dialog"
import { APP_NAME } from "@/lib/brand"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { WritingLesson } from "@/lib/learn/writing/types/lesson"

type TrailItem = { label: string; href?: string }

type WritingLessonPageViewProps = {
  language: LanguageHubCode
  level: string
  sectionId: string
  trail: TrailItem[]
  lesson: WritingLesson
  backHref: string
  nextLessonHref: string | null
}

export function WritingLessonPageView({
  language,
  level,
  sectionId,
  trail,
  lesson,
  backHref,
  nextLessonHref,
}: WritingLessonPageViewProps) {
  const focusMode = true
  const inProgress = true

  const handleBackClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!inProgress) return
      const ok = window.confirm("Thoát bài học? Tiến độ đã gõ vẫn được lưu trên máy này.")
      if (!ok) event.preventDefault()
    },
    [inProgress],
  )

  return (
    <div className="dlx-hero-gradient flex min-h-dvh flex-col">
      {focusMode ? (
        <VocabLessonFocusBar
          backHref={backHref}
          title={`Luyện viết · ${lesson.title}`}
          onBackClick={handleBackClick}
          howToDialog={
            <WritingLessonShortcutsDialog triggerClassName="size-9 shrink-0 rounded-full border-[var(--dlx-hairline)] bg-white shadow-none" />
          }
        />
      ) : (
        <>
          <SiteHeader tone="hero" />
          <LanguageHubToolbar language={language} trail={trail} />
        </>
      )}

      <main className={focusMode ? "flex flex-1 flex-col px-4 py-6 md:px-6 md:py-8" : PAGE_CONTAINER_WIDE}>
        <div className={focusMode ? "mx-auto w-full max-w-[48rem]" : PAGE_CONTENT_PY}>
          <WritingLessonPlayer
            language={language}
            level={level}
            sectionId={sectionId}
            lesson={lesson}
            backHref={backHref}
            nextLessonHref={nextLessonHref}
          />
        </div>
      </main>

      {!focusMode ? (
        <footer className="mt-auto shrink-0 border-t border-[var(--dlx-hairline)] py-6 text-center">
          <p className="font-body text-[11px] text-[rgb(160,160,152)]">© {APP_NAME}</p>
        </footer>
      ) : null}
    </div>
  )
}
