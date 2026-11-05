"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { authClient } from "@/lib/auth/client"
import type { VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"
import {
  apiClearVocabWeakItem,
  apiGetVocabWeakItems,
  apiClearVocabWeakWord,
  apiPostVocabCarry,
  apiPostVocabWeakItem,
} from "@/lib/learn/vocab/vocab-user-api"
import {
  loadCarriedWeakWords,
  saveCarriedWeakWordsForLesson,
  toCarriedWeakWord,
  type CarriedWeakWord,
} from "@/lib/learn/vocab/weak-word-carry"

type WeakSource = "flashcard_again" | "matching_wrong" | "main_quiz_wrong"

function wordToCarried(word: VocabLessonStory["words"][number]): CarriedWeakWord {
  return toCarriedWeakWord(word)
}

export function useVocabWeakSync(story: VocabLessonStory) {
  const { data: session } = authClient.useSession()
  const isLoggedIn = Boolean(session?.user)
  const lessonDbId = story.lessonDbId
  const nextLessonDbId = story.nextLessonDbId ?? null
  const nextGuestLessonId = story.nextStory?.id ?? null

  const [carriedWeak, setCarriedWeak] = useState<CarriedWeakWord[]>(() =>
    loadCarriedWeakWords(story.id),
  )
  const weakItemIdsRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    if (!isLoggedIn || !lessonDbId) {
      setCarriedWeak(loadCarriedWeakWords(story.id))
      weakItemIdsRef.current = new Map()
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const { items } = await apiGetVocabWeakItems(lessonDbId)
        if (cancelled) return
        const idMap = new Map<string, string>()
        const carried: CarriedWeakWord[] = []
        for (const item of items) {
          idMap.set(item.wordId, item.id)
          if (item.status === "carried" || item.weakSource === "carried_from_lesson") {
            carried.push(wordToCarried(item.word))
          }
        }
        weakItemIdsRef.current = idMap
        setCarriedWeak(carried)
      } catch {
        if (!cancelled) setCarriedWeak(loadCarriedWeakWords(story.id))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, lessonDbId, story.id])

  const syncWeak = useCallback(
    (wordId: string, source: WeakSource, reviewFlashcardRequired: boolean) => {
      if (isLoggedIn && lessonDbId) {
        void apiPostVocabWeakItem(lessonDbId, {
          wordId,
          lessonId: lessonDbId,
          weakSource: source,
          reviewFlashcardRequired,
        }).then(({ id }) => {
          weakItemIdsRef.current.set(wordId, id)
        })
      }
    },
    [isLoggedIn, lessonDbId],
  )

  const clearCarriedWord = useCallback(
    (wordId: string) => {
      const itemId = weakItemIdsRef.current.get(wordId)
      if (isLoggedIn && itemId) {
        void apiClearVocabWeakItem(itemId)
      }
    },
    [isLoggedIn],
  )

  const persistCarryForNextLesson = useCallback(
    (payload: CarriedWeakWord[]) => {
      if (payload.length === 0) {
        if (nextGuestLessonId) {
          saveCarriedWeakWordsForLesson(nextGuestLessonId, {}, [])
        }
        return
      }

      if (isLoggedIn && lessonDbId && nextLessonDbId) {
        void apiPostVocabCarry(nextLessonDbId, {
          sourceLessonId: lessonDbId,
          items: payload.map((w) => ({
            wordId: w.id,
            reviewFlashcardRequired: true,
          })),
        })
        return
      }

      const guestTarget = nextGuestLessonId
      if (guestTarget) {
        saveCarriedWeakWordsForLesson(
          guestTarget,
          { sourceLessonDbId: lessonDbId, sourceStoryId: story.id },
          payload,
        )
      }
    },
    [isLoggedIn, lessonDbId, nextLessonDbId, nextGuestLessonId, story.id],
  )

  const clearWeakWord = useCallback(
    (wordId: string) => {
      if (isLoggedIn && lessonDbId) {
        void apiClearVocabWeakWord(lessonDbId, wordId)
      }
    },
    [isLoggedIn, lessonDbId],
  )

  return { carriedWeak, syncWeak, clearCarriedWord, clearWeakWord, persistCarryForNextLesson }
}
