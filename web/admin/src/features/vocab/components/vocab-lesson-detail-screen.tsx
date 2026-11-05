"use client"

import { useEffect, useState } from "react"

import { VocabLessonDetailForm } from "@/features/vocab/components/vocab-lesson-detail-form"
import {
  useVocabCms,
  useVocabCmsGuardRedirect,
} from "@/features/vocab/context/vocab-cms-context"
import { vocabTopicLessonsHref } from "@/features/vocab/lib/vocab-cms-hrefs"
import type { VocabWordRow } from "@/features/vocab/lib/vocab-cms-mock"

type Props = { topicId: string; lessonId: string }

export function VocabLessonDetailScreen({ topicId, lessonId }: Props) {
  const { language, level, loadLessonWords, updateLesson, saveWords } = useVocabCms()
  const { ready, lesson } = useVocabCmsGuardRedirect({ topicId, lessonId })
  const [words, setWords] = useState<VocabWordRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready || !lesson) return
    void loadLessonWords(lessonId)
      .then(setWords)
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"))
  }, [lesson, lessonId, loadLessonWords, ready])

  if (!ready || !lesson) return null
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <VocabLessonDetailForm
      lesson={lesson}
      words={words}
      onLessonChange={(next) => {
        void updateLesson(next)
      }}
      onWordsSave={async (rows) => {
        await saveWords(lessonId, rows)
        setWords(rows)
      }}
      backHref={vocabTopicLessonsHref(topicId, language, level)}
    />
  )
}
