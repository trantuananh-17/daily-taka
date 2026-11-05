"use client"

import { useMemo } from "react"

import { VocabLessonDetailForm } from "@/features/vocab/components/vocab-lesson-detail-form"
import {
  useVocabCms,
  useVocabCmsGuardRedirect,
} from "@/features/vocab/context/vocab-cms-context"
import { vocabTopicLessonsHref } from "@/features/vocab/lib/vocab-cms-hrefs"

type VocabLessonDetailScreenProps = {
  topicId: string
  lessonId: string
}

export function VocabLessonDetailScreen({ topicId, lessonId }: VocabLessonDetailScreenProps) {
  const { language, level, wordsForLesson, updateLesson, saveWords } = useVocabCms()
  const { ready, lesson } = useVocabCmsGuardRedirect({ topicId, lessonId })

  const words = useMemo(
    () => (lesson ? wordsForLesson(lesson.id) : []),
    [lesson, wordsForLesson],
  )

  if (!ready || !lesson) return null

  return (
    <VocabLessonDetailForm
      lesson={lesson}
      words={words}
      onLessonChange={updateLesson}
      onWordsSave={(rows) => saveWords(lessonId, rows)}
      backHref={vocabTopicLessonsHref(topicId, language, level)}
    />
  )
}
