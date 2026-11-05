"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { ListenCreateSectionDialog } from "@/features/listen/components/listen-create-section-dialog"
import {
  buildListenSectionsTableColumns,
  LISTEN_SECTIONS_TABLE_FILTER,
} from "@/features/listen/components/listen-sections-table-columns"
import {
  useListenCms,
  useListenCmsGuardRedirect,
} from "@/features/listen/context/listen-cms-context"
import {
  listenCmsRootHref,
  listenSectionLessonsHref,
} from "@/features/listen/lib/listen-cms-hrefs"
import type { ListeningSection } from "@/features/listen/lib/listen-admin-api"

type Props = { categoryId: string }

export function ListenCategorySectionsScreen({ categoryId }: Props) {
  const router = useRouter()
  const { language, loadCategorySections, createSection } = useListenCms()
  const { ready, category } = useListenCmsGuardRedirect({ categoryId })
  const [sections, setSections] = useState<ListeningSection[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    void loadCategorySections(categoryId)
      .then(setSections)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Load failed"))
  }, [categoryId, loadCategorySections, ready])

  const openSection = useCallback(
    (row: ListeningSection) => {
      router.push(listenSectionLessonsHref(row.id, language))
    },
    [language, router],
  )

  const columns = useMemo(
    () => buildListenSectionsTableColumns({ onOpen: openSection }),
    [openSection],
  )

  if (!ready || !category) return null

  async function handleCreate(input: Parameters<typeof createSection>[1]) {
    const row = await createSection(categoryId, input)
    setSections((prev) => [...prev, row])
    router.push(listenSectionLessonsHref(row.id, language))
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
      {loadError ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {loadError}
        </p>
      ) : null}
      <AdminDataTablePanel
        title={`Chương (section) · ${category.name}`}
        description="Mỗi section = một chương trong category. Cần sectionNumber (DB bắt buộc)."
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm chương
          </Button>
        }
        columns={columns}
        data={sections.map((s) => ({
          ...s,
          access: s.access as "full" | "preview" | "locked",
          topicId: categoryId,
          topicName: category.name,
          lessonCount: 0,
        }))}
        filter={LISTEN_SECTIONS_TABLE_FILTER}
      />
      <ListenCreateSectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </>
  )
}
