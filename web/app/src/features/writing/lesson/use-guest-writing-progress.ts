"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  readGuestWritingLessonProgress,
  saveGuestWritingLessonProgress,
  type GuestWritingLessonKey,
} from "@/lib/learn/writing/guest-writing-lesson-progress"
import type { WritingLessonProgress } from "@/lib/learn/writing/types/lesson"

type UseGuestWritingProgressOptions = GuestWritingLessonKey & {
  sentenceCount: number
  seed: WritingLessonProgress
  scriptModeId?: string | null
  /** When false, use `seed` only (SSR resume) — skip guest localStorage. */
  loadFromLocalStorage?: boolean
}

export function useGuestWritingProgress({
  language,
  level,
  sectionId,
  lessonContentId,
  sentenceCount,
  seed,
  scriptModeId,
  lessonDbId,
  loadFromLocalStorage = true,
}: UseGuestWritingProgressOptions) {
  const storageKey = useMemo(
    () => ({ language, level, sectionId, lessonContentId, lessonDbId }),
    [language, level, sectionId, lessonContentId, lessonDbId],
  )

  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState<WritingLessonProgress>(seed)

  useEffect(() => {
    if (!loadFromLocalStorage) {
      const maxIndex = Math.max(0, sentenceCount - 1)
      setProgress({
        currentSentenceIndex: Math.min(maxIndex, Math.max(0, seed.currentSentenceIndex)),
        doneSentenceIndexes: [...new Set(seed.doneSentenceIndexes)].filter(
          (index) => index >= 0 && index < sentenceCount,
        ),
        drafts: seed.drafts ?? {},
      })
      setReady(true)
      return
    }

    const saved = readGuestWritingLessonProgress(storageKey)
    if (saved) {
      const maxIndex = Math.max(0, sentenceCount - 1)
      setProgress({
        currentSentenceIndex: Math.min(maxIndex, Math.max(0, saved.currentSentenceIndex)),
        doneSentenceIndexes: [...new Set(saved.doneSentenceIndexes)].filter(
          (index) => index >= 0 && index < sentenceCount,
        ),
        drafts: saved.drafts ?? {},
      })
    } else {
      setProgress(seed)
    }
    setReady(true)
  }, [storageKey, sentenceCount, seed, loadFromLocalStorage])

  useEffect(() => {
    if (!ready || !loadFromLocalStorage) return
    saveGuestWritingLessonProgress(storageKey, {
      ...progress,
      scriptModeId: scriptModeId ?? null,
      status:
        progress.doneSentenceIndexes.length >= sentenceCount && sentenceCount > 0
          ? "completed"
          : "in_progress",
    })
  }, [ready, storageKey, progress, scriptModeId, sentenceCount, loadFromLocalStorage])

  const setSentenceIndex = useCallback(
    (index: number | ((prev: number) => number)) => {
      setProgress((prev) => {
        const nextIndex = typeof index === "function" ? index(prev.currentSentenceIndex) : index
        const clamped = Math.min(Math.max(0, nextIndex), Math.max(0, sentenceCount - 1))
        return { ...prev, currentSentenceIndex: clamped }
      })
    },
    [sentenceCount],
  )

  const markSentenceDone = useCallback((index: number) => {
    setProgress((prev) => {
      const doneSentenceIndexes = prev.doneSentenceIndexes.includes(index)
        ? prev.doneSentenceIndexes
        : [...prev.doneSentenceIndexes, index].sort((a, b) => a - b)
      return { ...prev, doneSentenceIndexes }
    })
  }, [])

  const setDraft = useCallback((sentenceIndex: number, draft: string) => {
    setProgress((prev) => ({
      ...prev,
      drafts: { ...prev.drafts, [sentenceIndex]: draft },
    }))
  }, [])

  const clearDraft = useCallback((sentenceIndex: number) => {
    setProgress((prev) => {
      if (!prev.drafts?.[sentenceIndex]) return prev
      const drafts = { ...prev.drafts }
      delete drafts[sentenceIndex]
      return { ...prev, drafts }
    })
  }, [])

  return {
    ready,
    progress,
    sentenceIndex: progress.currentSentenceIndex,
    setSentenceIndex,
    markSentenceDone,
    setDraft,
    clearDraft,
    doneCount: progress.doneSentenceIndexes.length,
  }
}
