"use client"

import { useCallback, useState } from "react"

import { SiteHeader } from "@/components/layout/site-header"
import { PAGE_CONTAINER_WIDE, PAGE_CONTENT_PY } from "@/components/layout/marketing-page-shell"
import { VocabLessonFocusBar } from "@/features/vocab/lesson/vocab-lesson-focus-bar"
import { VocabLessonPlayer } from "@/features/vocab/lesson/vocab-lesson-player"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import { APP_NAME } from "@/lib/brand"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"

type TrailItem = { label: string; href?: string }

type VocabLessonPageViewProps = {
  language: LanguageHubCode
  trail: TrailItem[]
  story: VocabLessonStory
  backHref: string
  nextLessonHref: string | null
}

export function VocabLessonPageView({
  language,
  trail,
  story,
  backHref,
  nextLessonHref,
}: VocabLessonPageViewProps) {
  const [focusMode, setFocusMode] = useState(false)
  const [inProgressStep, setInProgressStep] = useState(false)

  const handleFocusModeChange = useCallback((focused: boolean, learningActive: boolean) => {
    setFocusMode(focused)
    setInProgressStep(learningActive)
  }, [])

  const handleBackClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!inProgressStep) return
      const ok = window.confirm("Thoát bài học? Tiến độ phiên này sẽ không được lưu.")
      if (!ok) event.preventDefault()
    },
    [inProgressStep],
  )

  return (
    <div className="dlx-hero-gradient flex min-h-dvh flex-col">
      {focusMode ? (
        <VocabLessonFocusBar backHref={backHref} title={story.title} onBackClick={handleBackClick} />
      ) : (
        <>
          <SiteHeader tone="hero" />
          <LanguageHubToolbar language={language} trail={trail} />
        </>
      )}

      <main className={focusMode ? "flex flex-1 flex-col px-4 py-6 md:px-6 md:py-8" : PAGE_CONTAINER_WIDE}>
        <div className={focusMode ? "mx-auto w-full max-w-[48rem]" : PAGE_CONTENT_PY}>
          <VocabLessonPlayer
            story={story}
            backHref={backHref}
            nextLessonHref={nextLessonHref}
            onFocusModeChange={handleFocusModeChange}
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
