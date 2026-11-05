"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { adminTableSelectColumn } from "@/components/data-table/admin-table-columns"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { WritingLessonRow } from "@/features/writing/lib/writing-cms-mock"
import { cn } from "cn"

export const WRITING_LESSONS_TABLE_FILTER = {
  primary: { columnId: "title", placeholder: "Lọc tiêu đề bài…" },
  secondary: { columnId: "slug", placeholder: "Lọc slug…" },
} as const

export function buildWritingLessonsTableColumns(options: {
  onOpen: (row: WritingLessonRow) => void
}): ColumnDef<WritingLessonRow>[] {
  return [
    adminTableSelectColumn<WritingLessonRow>(),
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tiêu đề" />,
      cell: ({ row }) => (
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-auto max-w-md truncate p-0 text-left font-medium",
          )}
          onClick={() => options.onOpen(row.original)}
        >
          {row.getValue("title") as string}
        </button>
      ),
    },
    {
      accessorKey: "contentId",
      header: "Content ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("contentId")}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "sentenceCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Câu" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{row.getValue("sentenceCount")}</div>
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
