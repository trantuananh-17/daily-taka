"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
import { useListenCms } from "@/features/listen/context/listen-cms-context"
import { fetchSectionLessons } from "@/features/listen/lib/listen-admin-api"
import { listenCmsRootHref, listenLessonDetailHref } from "@/features/listen/lib/listen-cms-hrefs"
import type { ListeningLesson } from "@/features/listen/lib/listen-admin-api"

type Props = { sectionId: string }

export function ListenSectionLessonsScreen({ sectionId }: Props) {
  const router = useRouter()
  const { language, createLesson } = useListenCms()
  const [lessons, setLessons] = useState<ListeningLesson[]>([])
  const [sectionTitle, setSectionTitle] = useState("—")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    void fetchSectionLessons(language, sectionId)
      .then((data) => {
        setSectionTitle(data.section.title)
        setLessons(data.lessons)
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Load failed"))
  }, [language, sectionId])

  const openLesson = useCallback(
    (row: ListeningLesson) => {
      router.push(listenLessonDetailHref(sectionId, row.id, language))
    },
    [language, router, sectionId],
  )

  const lessonColumns = useMemo(
    () => buildListenLessonsTableColumns({ onOpen: openLesson }),
    [openLesson],
  )

  async function handleCreateLesson(input: Record<string, unknown>) {
    const row = await createLesson(sectionId, input)
    setLessons((prev) => [...prev, row])
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
          Quay lại categories
        </Link>
      </div>
      {loadError ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {loadError}
        </p>
      ) : null}
      <AdminDataTablePanel
        title={`Bài học · ${sectionTitle}`}
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm bài học
          </Button>
        }
        columns={lessonColumns}
        data={lessons.map((l) => ({
          ...l,
          sectionTitle,
          sectionId,
        }))}
        filter={LISTEN_LESSONS_TABLE_FILTER}
      />
      <ListenCreateLessonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateLesson}
      />
    </>
  )
}
