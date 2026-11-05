"use client"

import { useMemo } from "react"

import { WritingLessonDetailForm } from "@/features/writing/components/writing-lesson-detail-form"
import {
  useWritingCms,
  useWritingCmsGuardRedirect,
} from "@/features/writing/context/writing-cms-context"
import { writingTopicLessonsHref } from "@/features/writing/lib/writing-cms-hrefs"

type Props = { topicId: string; lessonId: string }

export function WritingLessonDetailScreen({ topicId, lessonId }: Props) {
  const { language, level, sentencesForLesson, updateLesson, saveSentences } = useWritingCms()
  const { ready, lesson } = useWritingCmsGuardRedirect({ topicId, lessonId })

  const sentences = useMemo(
    () => (lesson ? sentencesForLesson(lesson.id) : []),
    [lesson, sentencesForLesson],
  )

  if (!ready || !lesson) return null

  return (
    <WritingLessonDetailForm
      lesson={lesson}
      sentences={sentences}
      onLessonChange={updateLesson}
      onSentencesSave={(rows) => saveSentences(lessonId, rows)}
      backHref={writingTopicLessonsHref(topicId, language, level)}
    />
  )
}
