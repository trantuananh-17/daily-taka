"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { ListenCreateLessonDialog } from "@/features/listen/components/listen-create-lesson-dialog"
import {
  buildListenLessonsTableColumns,
  LISTEN_LESSONS_TABLE_FILTER,
} from "@/features/listen/components/listen-lessons-table-columns"
import {
  useListenCms,
  useListenCmsGuardRedirect,
} from "@/features/listen/context/listen-cms-context"
import {
  listenCmsRootHref,
  listenLessonDetailHref,
} from "@/features/listen/lib/listen-cms-hrefs"
import type { ListenLessonRow } from "@/features/listen/lib/listen-cms-mock"

type ListenSectionLessonsScreenProps = {
  sectionId: string
}

export function ListenSectionLessonsScreen({ sectionId }: ListenSectionLessonsScreenProps) {
  const router = useRouter()
  const { language, lessonsForSection, createLesson } = useListenCms()
  const { ready, section } = useListenCmsGuardRedirect({ sectionId })
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false)

  const sectionLessons = lessonsForSection(sectionId)

  const openLesson = useCallback(
    (row: ListenLessonRow) => {
      router.push(listenLessonDetailHref(sectionId, row.id, language))
    },
    [language, router, sectionId],
  )

  const lessonColumns = useMemo(
    () => buildListenLessonsTableColumns({ onOpen: openLesson }),
    [openLesson],
  )

  if (!ready || !section) {
    return null
  }

  function handleCreateLesson(input: Parameters<typeof createLesson>[1]) {
    const row = createLesson(sectionId, input)
    router.push(listenLessonDetailHref(sectionId, row.id, language))
  }

  return (
    <>
      <div className="mb-4">
        <Link
          href={listenCmsRootHref(language)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          Quay lại
        </Link>
      </div>
      <AdminDataTablePanel
        title={`Bài học · ${section.title}`}
        action={
          <Button size="sm" onClick={() => setLessonDialogOpen(true)}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm bài học
          </Button>
        }
        columns={lessonColumns}
        data={sectionLessons}
        filter={LISTEN_LESSONS_TABLE_FILTER}
      />
      <ListenCreateLessonDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        onSubmit={handleCreateLesson}
      />
    </>
  )
}
