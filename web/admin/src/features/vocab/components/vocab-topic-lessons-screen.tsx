"use client"

import { useCallback, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import {
  buildVocabLessonsTableColumns,
  VOCAB_LESSONS_TABLE_FILTER,
} from "@/features/vocab/components/vocab-lessons-table-columns"
import {
  useVocabCms,
  useVocabCmsGuardRedirect,
} from "@/features/vocab/context/vocab-cms-context"
import {
  vocabCmsRootHref,
  vocabLessonDetailHref,
} from "@/features/vocab/lib/vocab-cms-hrefs"
import type { VocabLessonRow } from "@/features/vocab/lib/vocab-cms-mock"

type VocabTopicLessonsScreenProps = {
  topicId: string
}

export function VocabTopicLessonsScreen({ topicId }: VocabTopicLessonsScreenProps) {
  const router = useRouter()
  const { language, level, lessonsForTopic } = useVocabCms()
  const { ready, topic } = useVocabCmsGuardRedirect({ topicId })

  const rows = lessonsForTopic(topicId)

  const openLesson = useCallback(
    (row: VocabLessonRow) => {
      router.push(vocabLessonDetailHref(topicId, row.id, language, level))
    },
    [language, level, router, topicId],
  )

  const columns = useMemo(
    () => buildVocabLessonsTableColumns({ onOpen: openLesson }),
    [openLesson],
  )

  if (!ready || !topic) return null

  return (
    <>
      <div className="mb-4">
        <Link
          href={vocabCmsRootHref(language, level)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          Quay lại
        </Link>
      </div>
      <AdminDataTablePanel
        title={`Bài học · ${topic.title}`}
        action={null}
        columns={columns}
        data={rows}
        filter={VOCAB_LESSONS_TABLE_FILTER}
      />
    </>
  )
}
