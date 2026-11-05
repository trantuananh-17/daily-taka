"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button } from "@/components/ui/button"
import { ListenCreateSectionDialog } from "@/features/listen/components/listen-create-section-dialog"
import { ListenPageHeader } from "@/features/listen/components/listen-page-header"
import {
  buildListenSectionsTableColumns,
  LISTEN_SECTIONS_TABLE_FILTER,
} from "@/features/listen/components/listen-sections-table-columns"
import { useListenCms } from "@/features/listen/context/listen-cms-context"
import { listenSectionLessonsHref } from "@/features/listen/lib/listen-cms-hrefs"
import type { ListenSectionRow } from "@/features/listen/lib/listen-cms-mock"

export function ListenSectionsScreen() {
  const router = useRouter()
  const {
    language,
    languageLabel,
    setLanguage,
    sections,
    topics,
    refreshTopics,
    createSection,
  } = useListenCms()
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)

  const openSection = useCallback(
    (row: ListenSectionRow) => {
      router.push(listenSectionLessonsHref(row.id, language))
    },
    [language, router],
  )

  const sectionColumns = useMemo(
    () => buildListenSectionsTableColumns({ onOpen: openSection }),
    [openSection],
  )

  function openSectionDialog() {
    refreshTopics()
    setSectionDialogOpen(true)
  }

  return (
    <>
      <ListenPageHeader
        language={language}
        languageLabel={languageLabel}
        onLanguageChange={setLanguage}
      />
      <AdminDataTablePanel
        title="Lesson (chương / section)"
        description={
          <>
            Một <strong className="font-medium text-foreground">lesson</strong> ở đây là chương (section).
            Bấm <strong className="font-medium text-foreground">tiêu đề</strong> để xem bài học bên trong.
          </>
        }
        action={
          <Button size="sm" onClick={openSectionDialog}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm lesson
          </Button>
        }
        columns={sectionColumns}
        data={sections}
        filter={LISTEN_SECTIONS_TABLE_FILTER}
      />
      <ListenCreateSectionDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        topics={topics}
        onSubmit={createSection}
      />
    </>
  )
}
