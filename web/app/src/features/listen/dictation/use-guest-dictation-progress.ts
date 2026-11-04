"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  clearGuestDictationLessonProgress,
  readGuestDictationLessonProgress,
  saveGuestDictationLessonProgress,
  type GuestDictationLessonKey,
} from "@/lib/learn/listening/guest-dictation-lesson-progress"
import { upsertGuestLessonProgress } from "@/lib/learn/listening/guest-listening-progress"

type UseGuestDictationProgressOptions = GuestDictationLessonKey & {
  sentenceCount: number
}

export function useGuestDictationProgress({
  language,
  categorySlug,
  sectionId,
  lessonId,
  sentenceCount,
}: UseGuestDictationProgressOptions) {
  const storageKey = useMemo(
    () => ({ language, categorySlug, sectionId, lessonId }),
    [language, categorySlug, sectionId, lessonId],
  )

  const [ready, setReady] = useState(false)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    const saved = readGuestDictationLessonProgress(storageKey)
    if (saved) {
      const maxIndex = Math.max(0, sentenceCount - 1)
      setCorrectCount(Math.min(sentenceCount, Math.max(0, saved.correctCount)))
      setSentenceIndex(Math.min(maxIndex, Math.max(0, saved.currentSentenceIndex)))
    } else {
      setCorrectCount(0)
      setSentenceIndex(0)
    }
    setReady(true)
  }, [storageKey, sentenceCount])

  useEffect(() => {
    if (!ready) return
    saveGuestDictationLessonProgress(storageKey, {
      correctCount,
      currentSentenceIndex: sentenceIndex,
    })

    if (correctCount >= sentenceCount && sentenceCount > 0) {
      upsertGuestLessonProgress({
        language,
        categorySlug,
        sectionId,
        lessonId,
        status: "completed",
        completedAt: new Date().toISOString(),
      })
    } else if (correctCount > 0 || sentenceIndex > 0) {
      upsertGuestLessonProgress({
        language,
        categorySlug,
        sectionId,
        lessonId,
        status: "in_progress",
      })
    }
  }, [ready, storageKey, correctCount, sentenceIndex, sentenceCount, language, categorySlug, sectionId, lessonId])

  const resetProgress = useCallback(() => {
    clearGuestDictationLessonProgress(storageKey)
    setCorrectCount(0)
    setSentenceIndex(0)
    upsertGuestLessonProgress({
      language,
      categorySlug,
      sectionId,
      lessonId,
      status: "in_progress",
    })
  }, [storageKey, language, categorySlug, sectionId, lessonId])

  return {
    ready,
    sentenceIndex,
    setSentenceIndex,
    correctCount,
    setCorrectCount,
    resetProgress,
  }
}
