"use client"

import { useEffect, useState } from "react"

import { ListenLessonDetailForm } from "@/features/listen/components/listen-lesson-detail-form"
import { useListenCms } from "@/features/listen/context/listen-cms-context"
import { listenSectionLessonsHref } from "@/features/listen/lib/listen-cms-hrefs"
import type { ListeningLesson, ListeningSentence } from "@/features/listen/lib/listen-admin-api"

type Props = { sectionId: string; lessonId: string }

export function ListenLessonDetailScreen({ sectionId, lessonId }: Props) {
  const { language, loadLessonDetail, updateLesson, saveSentences } = useListenCms()
  const [lesson, setLesson] = useState<ListeningLesson | null>(null)
  const [sentences, setSentences] = useState<ListeningSentence[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void loadLessonDetail(lessonId)
      .then((data) => {
        setLesson(data.lesson)
        setSentences(data.sentences)
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"))
  }, [lessonId, loadLessonDetail])

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!lesson) return null

  return (
    <ListenLessonDetailForm
      lesson={lesson}
      sectionTitle={sectionId}
      sentences={sentences}
      onLessonChange={(next) => {
        setLesson(next)
        void updateLesson(next)
      }}
      onSentencesSave={async (rows) => {
        await saveSentences(lessonId, rows)
        setSentences(
          rows.map((r, i) => ({
            id: sentences[i]?.id ?? `local-${i}`,
            lessonId,
            position: r.position,
            startMs: r.startMs,
            endMs: r.endMs,
            transcript: r.transcript,
          })),
        )
      }}
      backHref={listenSectionLessonsHref(sectionId, language)}
    />
  )
}
