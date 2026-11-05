"use client"

import { useEffect, useRef } from "react"

import { authClient } from "@/lib/auth/client"
import { useDebouncedEffect } from "@/lib/use-debounced-effect"
import { useGuestWritingProgress } from "@/features/writing/lesson/use-guest-writing-progress"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { apiPutWritingLessonProgress } from "@/lib/learn/writing/writing-user-api"
import type { WritingLesson } from "@/lib/learn/writing/types/lesson"

const PROGRESS_DEBOUNCE_MS = 700

type UseWritingLessonProgressOptions = {
  language: LanguageHubCode
  level: string
  sectionId: string
  lesson: WritingLesson
  scriptModeId: string
  progressLessonId: string
  sentenceCount: number
}

function progressHasServerState(lesson: WritingLesson) {
  const p = lesson.progress
  return (
    p.currentSentenceIndex > 0 ||
    p.doneSentenceIndexes.length > 0 ||
    Object.keys(p.drafts ?? {}).length > 0
  )
}

export function useWritingLessonProgress({
  language,
  level,
  sectionId,
  lesson,
  scriptModeId,
  progressLessonId,
  sentenceCount,
}: UseWritingLessonProgressOptions) {
  const { data: session } = authClient.useSession()
  const isLoggedIn = Boolean(session?.user)
  const lessonDbId = lesson.lessonDbId
  const serverSnapshotRef = useRef(lesson.progress)
  const initialProgressRef = useRef(lesson.progress)
  const userDirtyRef = useRef(false)

  const guest = useGuestWritingProgress({
    language,
    level,
    sectionId,
    lessonContentId: progressLessonId,
    lessonDbId,
    sentenceCount,
    seed: lesson.progress,
    scriptModeId,
    loadFromLocalStorage: !isLoggedIn || !lessonDbId,
  })

  useEffect(() => {
    const initial = initialProgressRef.current
    const current = guest.progress
    if (
      current.currentSentenceIndex !== initial.currentSentenceIndex ||
      current.doneSentenceIndexes.length !== initial.doneSentenceIndexes.length ||
      JSON.stringify(current.drafts ?? {}) !== JSON.stringify(initial.drafts ?? {})
    ) {
      userDirtyRef.current = true
    }
  }, [guest.progress])

  useDebouncedEffect(
    () => {
      if (!guest.ready || !isLoggedIn || !lessonDbId || language !== "en") return

      const status =
        guest.progress.doneSentenceIndexes.length >= sentenceCount && sentenceCount > 0
          ? "completed"
          : "in_progress"

      const server = serverSnapshotRef.current
      if (
        !userDirtyRef.current &&
        progressHasServerState({ ...lesson, progress: server }) &&
        server.currentSentenceIndex === guest.progress.currentSentenceIndex &&
        server.doneSentenceIndexes.length === guest.progress.doneSentenceIndexes.length
      ) {
        return
      }

      void apiPutWritingLessonProgress(lessonDbId, {
        status,
        currentSentenceIndex: guest.progress.currentSentenceIndex,
        doneSentenceIndexes: guest.progress.doneSentenceIndexes,
        drafts: Object.fromEntries(
          Object.entries(guest.progress.drafts ?? {}).map(([k, v]) => [String(k), v]),
        ),
        scriptModeId,
      })
    },
    [
      guest.ready,
      guest.progress,
      isLoggedIn,
      lessonDbId,
      language,
      scriptModeId,
      sentenceCount,
      lesson,
    ],
    PROGRESS_DEBOUNCE_MS,
  )

  return guest
}
