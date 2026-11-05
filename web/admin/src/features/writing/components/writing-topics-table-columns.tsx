"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { adminTableSelectColumn } from "@/components/data-table/admin-table-columns"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { WritingTopicRow } from "@/features/writing/lib/writing-cms-mock"
import { cn } from "cn"

export const WRITING_TOPICS_TABLE_FILTER = {
  primary: { columnId: "title", placeholder: "Lọc chủ đề…" },
  secondary: { columnId: "slug", placeholder: "Lọc slug…" },
} as const

export function buildWritingTopicsTableColumns(options: {
  onOpen: (row: WritingTopicRow) => void
}): ColumnDef<WritingTopicRow>[] {
  return [
    adminTableSelectColumn<WritingTopicRow>(),
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Chủ đề" />,
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
      accessorKey: "slug",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("slug")}</span>
      ),
    },
    {
      accessorKey: "lessonCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bài" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{row.getValue("lessonCount")}</div>
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
