"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button } from "@/components/ui/button"
import { ListenCreateTopicDialog } from "@/features/listen/components/listen-create-topic-dialog"
import { ListenPageHeader } from "@/features/listen/components/listen-page-header"
import { useListenCms } from "@/features/listen/context/listen-cms-context"
import { listenCategorySectionsHref } from "@/features/listen/lib/listen-cms-hrefs"
import type { ListeningCategory } from "@/features/listen/lib/listen-admin-api"
import {
  buildListenCategoriesTableColumns,
  LISTEN_CATEGORIES_TABLE_FILTER,
} from "@/features/listen/components/listen-categories-table-columns"

export function ListenCategoriesScreen() {
  const router = useRouter()
  const {
    language,
    languageLabel,
    setLanguage,
    categories,
    refreshCategories,
    createCategory,
    loading,
    error,
  } = useListenCms()
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    void refreshCategories()
  }, [language, refreshCategories])

  const openCategory = useCallback(
    (row: ListeningCategory) => {
      router.push(listenCategorySectionsHref(row.id, language))
    },
    [language, router],
  )

  const columns = useMemo(
    () => buildListenCategoriesTableColumns({ onOpen: openCategory }),
    [openCategory],
  )

  return (
    <>
      <ListenPageHeader
        language={language}
        languageLabel={languageLabel}
        onLanguageChange={setLanguage}
      />
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <AdminDataTablePanel
        title="Chủ đề nghe (categories)"
        description="Khớp thẻ hub learner — Short Stories, Conversations, … Theo từng ngôn ngữ."
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)} disabled={loading}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm chủ đề
          </Button>
        }
        columns={columns}
        data={categories}
        filter={LISTEN_CATEGORIES_TABLE_FILTER}
      />
      <ListenCreateTopicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={createCategory}
      />
    </>
  )
}
