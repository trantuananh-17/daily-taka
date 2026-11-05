"use client"

import { useMemo } from "react"

import { ListenLessonDetailForm } from "@/features/listen/components/listen-lesson-detail-form"
import {
  useListenCms,
  useListenCmsGuardRedirect,
} from "@/features/listen/context/listen-cms-context"
import { listenSectionLessonsHref } from "@/features/listen/lib/listen-cms-hrefs"

type ListenLessonDetailScreenProps = {
  sectionId: string
  lessonId: string
}

export function ListenLessonDetailScreen({ sectionId, lessonId }: ListenLessonDetailScreenProps) {
  const { language, sentencesForLesson, updateLesson, saveSentences } = useListenCms()
  const { ready, lesson } = useListenCmsGuardRedirect({ sectionId, lessonId })

  const sentences = useMemo(
    () => (lesson ? sentencesForLesson(lesson.id) : []),
    [lesson, sentencesForLesson],
  )

  if (!ready || !lesson) {
    return null
  }

  return (
    <ListenLessonDetailForm
      lesson={lesson}
      sentences={sentences}
      onLessonChange={updateLesson}
      onSentencesSave={(rows) => saveSentences(lessonId, rows)}
      backHref={listenSectionLessonsHref(sectionId, language)}
    />
  )
}
