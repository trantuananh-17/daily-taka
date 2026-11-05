"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button } from "@/components/ui/button"
import { WritingCreateTopicDialog } from "@/features/writing/components/writing-create-topic-dialog"
import { WritingPageHeader } from "@/features/writing/components/writing-page-header"
import {
  buildWritingTopicsTableColumns,
  WRITING_TOPICS_TABLE_FILTER,
} from "@/features/writing/components/writing-topics-table-columns"
import { useWritingCms } from "@/features/writing/context/writing-cms-context"
import { writingTopicLessonsHref } from "@/features/writing/lib/writing-cms-hrefs"
import type { WritingTopicRow } from "@/features/writing/lib/writing-cms-mock"

export function WritingTopicsScreen() {
  const router = useRouter()
  const {
    language,
    languageLabel,
    level,
    levelOptions,
    setLanguage,
    setLevel,
    topics,
    createTopic,
  } = useWritingCms()
  const [dialogOpen, setDialogOpen] = useState(false)

  const openTopic = useCallback(
    (row: WritingTopicRow) => {
      router.push(writingTopicLessonsHref(row.id, language, level))
    },
    [language, level, router],
  )

  const columns = useMemo(
    () => buildWritingTopicsTableColumns({ onOpen: openTopic }),
    [openTopic],
  )

  return (
    <>
      <WritingPageHeader
        language={language}
        languageLabel={languageLabel}
        level={level}
        levelOptions={levelOptions}
        onLanguageChange={setLanguage}
        onLevelChange={setLevel}
      />
      <AdminDataTablePanel
        title="Chủ đề (topic)"
        description="Level cố định theo learner app — chọn level trên header."
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm chủ đề
          </Button>
        }
        columns={columns}
        data={topics}
        filter={WRITING_TOPICS_TABLE_FILTER}
      />
      <WritingCreateTopicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={createTopic}
      />
    </>
  )
}
