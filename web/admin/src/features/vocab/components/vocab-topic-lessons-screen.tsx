"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { VocabCreateLessonDialog } from "@/features/vocab/components/vocab-create-lesson-dialog"
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
  const { language, level, lessonsForTopic, createLesson } = useVocabCms()
  const { ready, topic } = useVocabCmsGuardRedirect({ topicId })
  const [dialogOpen, setDialogOpen] = useState(false)

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

  function handleCreate(input: Parameters<typeof createLesson>[1]) {
    const row = createLesson(topicId, input)
    router.push(vocabLessonDetailHref(topicId, row.id, language, level))
  }

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
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm bài học
          </Button>
        }
        columns={columns}
        data={rows}
        filter={VOCAB_LESSONS_TABLE_FILTER}
      />
      <VocabCreateLessonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </>
  )
}
