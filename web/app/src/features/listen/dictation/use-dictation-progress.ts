"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { authClient } from "@/lib/auth/client"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { useGuestDictationProgress } from "@/features/listen/dictation/use-guest-dictation-progress"
import {
  apiCompleteListenLesson,
  apiPutListenLessonProgress,
  apiRestartListenLesson,
  apiGetListenLessonProgress,
} from "@/lib/learn/listening/listening-user-api"

type UseDictationProgressOptions = {
  language: LanguageHubCode
  categorySlug: string
  sectionId: string
  lessonId: string
  sentenceCount: number
}

export function useDictationProgress(options: UseDictationProgressOptions) {
  const { data: session } = authClient.useSession()
  const isLoggedIn = Boolean(session?.user)

  const guest = useGuestDictationProgress({ ...options, persistLocal: !isLoggedIn })
  const [serverReady, setServerReady] = useState(!isLoggedIn)
  const completeSentRef = useRef(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setServerReady(true)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const { progress } = await apiGetListenLessonProgress(options.lessonId)
        if (cancelled || !progress) {
          setServerReady(true)
          return
        }
        const maxIndex = Math.max(0, options.sentenceCount - 1)
        guest.setCorrectCount(Math.min(options.sentenceCount, progress.completedSentenceCount))
        guest.setSentenceIndex(Math.min(maxIndex, Math.max(0, progress.lastSentencePosition - 1)))
        completeSentRef.current = progress.status === "completed"
      } catch {
        /* guest fallback */
      } finally {
        if (!cancelled) setServerReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per lesson login
  }, [isLoggedIn, options.lessonId, options.sentenceCount])

  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isLoggedIn || !serverReady) return

    if (persistTimer.current) clearTimeout(persistTimer.current)
    persistTimer.current = setTimeout(() => {
      void apiPutListenLessonProgress(options.lessonId, {
        completedSentenceCount: guest.correctCount,
        lastSentencePosition: guest.sentenceIndex + 1,
        status:
          guest.correctCount >= options.sentenceCount && options.sentenceCount > 0
            ? "completed"
            : guest.correctCount > 0 || guest.sentenceIndex > 0
              ? "in_progress"
              : "not_started",
      })
    }, 400)

    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current)
    }
  }, [
    guest.correctCount,
    guest.sentenceIndex,
    isLoggedIn,
    options.lessonId,
    options.sentenceCount,
    serverReady,
  ])

  useEffect(() => {
    if (!isLoggedIn || !serverReady) return
    if (options.sentenceCount <= 0) return
    if (guest.correctCount < options.sentenceCount) return
    if (completeSentRef.current) return

    completeSentRef.current = true
    void apiCompleteListenLesson(options.lessonId)
  }, [guest.correctCount, isLoggedIn, options.lessonId, options.sentenceCount, serverReady])

  const resetProgress = useCallback(() => {
    guest.resetProgress()
    completeSentRef.current = false
    if (isLoggedIn) {
      void apiRestartListenLesson(options.lessonId)
    }
  }, [guest, isLoggedIn, options.lessonId])

  const ready = useMemo(
    () => (isLoggedIn ? serverReady && guest.ready : guest.ready),
    [guest.ready, isLoggedIn, serverReady],
  )

  return {
    ready,
    sentenceIndex: guest.sentenceIndex,
    setSentenceIndex: guest.setSentenceIndex,
    correctCount: guest.correctCount,
    setCorrectCount: guest.setCorrectCount,
    resetProgress,
    isLoggedIn,
  }
}
