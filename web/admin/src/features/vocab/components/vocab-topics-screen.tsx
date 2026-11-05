"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
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
    error,
    loading,
  } = useVocabCms()

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
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
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
        action={null}
        columns={columns}
        data={loading ? [] : topics}
        filter={VOCAB_TOPICS_TABLE_FILTER}
      />
    </>
  )
}
