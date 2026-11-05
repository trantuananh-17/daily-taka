"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { WritingCreateLessonDialog } from "@/features/writing/components/writing-create-lesson-dialog"
import {
  buildWritingLessonsTableColumns,
  WRITING_LESSONS_TABLE_FILTER,
} from "@/features/writing/components/writing-lessons-table-columns"
import {
  useWritingCms,
  useWritingCmsGuardRedirect,
} from "@/features/writing/context/writing-cms-context"
import {
  writingCmsRootHref,
  writingLessonDetailHref,
} from "@/features/writing/lib/writing-cms-hrefs"
import type { WritingLessonRow } from "@/features/writing/lib/writing-cms-mock"

type Props = { topicId: string }

export function WritingTopicLessonsScreen({ topicId }: Props) {
  const router = useRouter()
  const { language, level, lessonsForTopic, createLesson } = useWritingCms()
  const { ready, topic } = useWritingCmsGuardRedirect({ topicId })
  const [dialogOpen, setDialogOpen] = useState(false)

  const rows = lessonsForTopic(topicId)

  const openLesson = useCallback(
    (row: WritingLessonRow) => {
      router.push(writingLessonDetailHref(topicId, row.id, language, level))
    },
    [language, level, router, topicId],
  )

  const columns = useMemo(
    () => buildWritingLessonsTableColumns({ onOpen: openLesson }),
    [openLesson],
  )

  if (!ready || !topic) return null

  function handleCreate(input: Parameters<typeof createLesson>[1]) {
    const row = createLesson(topicId, input)
    router.push(writingLessonDetailHref(topicId, row.id, language, level))
  }

  return (
    <>
      <div className="mb-4">
        <Link
          href={writingCmsRootHref(language, level)}
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
        filter={WRITING_LESSONS_TABLE_FILTER}
      />
      <WritingCreateLessonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </>
  )
}
