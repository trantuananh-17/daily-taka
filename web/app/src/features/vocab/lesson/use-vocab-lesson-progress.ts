"use client"

import { useEffect, useRef } from "react"

import { authClient } from "@/lib/auth/client"
import { useDebouncedEffect } from "@/lib/use-debounced-effect"
import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  upsertGuestVocabLessonProgress,
  type GuestVocabLessonProgressEntry,
} from "@/lib/learn/vocab/guest-vocab-lesson-progress"
import type { VocabLessonStep, VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"
import {
  apiCompleteVocabLesson,
  apiPutVocabLessonProgress,
} from "@/lib/learn/vocab/vocab-user-api"

const PROGRESS_DEBOUNCE_MS = 700

type UseVocabLessonProgressOptions = {
  language: LanguageHubCode
  level: string
  sectionId: string
  story: VocabLessonStory
  step: VocabLessonStep
  masteredCount: number
}

export function useVocabLessonProgress({
  language,
  level,
  sectionId,
  story,
  step,
  masteredCount,
}: UseVocabLessonProgressOptions) {
  const { data: session } = authClient.useSession()
  const isLoggedIn = Boolean(session?.user)
  const lessonDbId = story.lessonDbId
  const serverProgress = story.lessonProgress
  const initialStepRef = useRef(step)
  const initialMasteredRef = useRef(masteredCount)
  const userDirtyRef = useRef(false)

  useEffect(() => {
    if (step !== initialStepRef.current || masteredCount !== initialMasteredRef.current) {
      userDirtyRef.current = true
    }
  }, [step, masteredCount])

  useEffect(() => {
    if (step !== "lessonComplete" || !isLoggedIn || !lessonDbId) return
    void apiCompleteVocabLesson(lessonDbId, masteredCount)
  }, [step, isLoggedIn, lessonDbId, masteredCount])

  useDebouncedEffect(
    () => {
      if (language !== "en") return
      if (step === "lessonComplete") return

      if (isLoggedIn && lessonDbId) {
        if (
          !userDirtyRef.current &&
          serverProgress &&
          serverProgress.currentStep === step &&
          serverProgress.masteredCount === masteredCount
        ) {
          return
        }
        void apiPutVocabLessonProgress(lessonDbId, {
          status: "in_progress",
          currentStep: step,
          masteredCount,
        })
        return
      }

      if (!lessonDbId) return

      const entry: GuestVocabLessonProgressEntry = {
        language: "en",
        level: decodeURIComponent(level),
        sectionId,
        lessonId: lessonDbId,
        storyId: story.id,
        status: "in_progress",
        currentStep: step,
        masteredCount,
      }
      upsertGuestVocabLessonProgress(entry)
    },
    [isLoggedIn, lessonDbId, language, level, sectionId, story.id, step, masteredCount, serverProgress],
    PROGRESS_DEBOUNCE_MS,
  )
}
