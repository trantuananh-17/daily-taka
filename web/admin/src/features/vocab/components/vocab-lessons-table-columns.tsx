"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { adminTableSelectColumn } from "@/components/data-table/admin-table-columns"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { VocabLessonRow } from "@/features/vocab/lib/vocab-cms-mock"
import { cn } from "cn"

export const VOCAB_LESSONS_TABLE_FILTER = {
  primary: { columnId: "title", placeholder: "Lọc tiêu đề bài…" },
  secondary: { columnId: "slug", placeholder: "Lọc slug…" },
} as const

export function buildVocabLessonsTableColumns(options: {
  onOpen: (row: VocabLessonRow) => void
}): ColumnDef<VocabLessonRow>[] {
  return [
    adminTableSelectColumn<VocabLessonRow>(),
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tiêu đề" />,
      cell: ({ row }) => {
        const title = row.getValue("title") as string
        return (
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto max-w-md truncate p-0 text-left font-medium",
            )}
            onClick={() => options.onOpen(row.original)}
          >
            {title}
          </button>
        )
      },
    },
    {
      accessorKey: "storyId",
      header: "Story ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("storyId")}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("slug")}</span>
      ),
    },
    {
      accessorKey: "wordCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Từ" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{row.getValue("wordCount")}</div>
      ),
    },
    {
      accessorKey: "isPublished",
      header: "Trạng thái",
      cell: ({ row }) =>
        row.getValue("isPublished") ? (
          <Badge>Đã xuất bản</Badge>
        ) : (
          <Badge variant="secondary">Nháp</Badge>
        ),
      enableSorting: false,
    },
  ]
}
