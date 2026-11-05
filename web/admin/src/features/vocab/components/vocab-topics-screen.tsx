"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button } from "@/components/ui/button"
import { VocabCreateTopicDialog } from "@/features/vocab/components/vocab-create-topic-dialog"
import { VocabPageHeader } from "@/features/vocab/components/vocab-page-header"
import {
  buildVocabTopicsTableColumns,
  VOCAB_TOPICS_TABLE_FILTER,
} from "@/features/vocab/components/vocab-topics-table-columns"
import { useVocabCms } from "@/features/vocab/context/vocab-cms-context"
import { vocabTopicLessonsHref } from "@/features/vocab/lib/vocab-cms-hrefs"
import type { VocabTopicRow } from "@/features/vocab/lib/vocab-cms-mock"

export function VocabTopicsScreen() {
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
  } = useVocabCms()
  const [dialogOpen, setDialogOpen] = useState(false)

  const openTopic = useCallback(
    (row: VocabTopicRow) => {
      router.push(vocabTopicLessonsHref(row.id, language, level))
    },
    [language, level, router],
  )

  const columns = useMemo(
    () => buildVocabTopicsTableColumns({ onOpen: openTopic }),
    [openTopic],
  )

  return (
    <>
      <VocabPageHeader
        language={language}
        languageLabel={languageLabel}
        level={level}
        levelOptions={levelOptions}
        onLanguageChange={setLanguage}
        onLevelChange={setLevel}
      />
      <AdminDataTablePanel
        title="Chủ đề (topic)"
        description={
          <>
            Chọn <strong className="font-medium text-foreground">level</strong> ở header — danh sách
            topic theo curriculum. Bấm tiêu đề để mở bài học.
          </>
        }
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm chủ đề
          </Button>
        }
        columns={columns}
        data={topics}
        filter={VOCAB_TOPICS_TABLE_FILTER}
      />
      <VocabCreateTopicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={createTopic}
      />
    </>
  )
}
