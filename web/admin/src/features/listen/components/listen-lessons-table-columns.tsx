"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { adminTableSelectColumn } from "@/components/data-table/admin-table-columns"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { ListenLessonRow } from "@/features/listen/lib/listen-cms-mock"
import { cn } from "cn"

export const LISTEN_LESSONS_TABLE_FILTER = {
  primary: { columnId: "title", placeholder: "Lọc tiêu đề bài…" },
  secondary: { columnId: "slug", placeholder: "Lọc slug…" },
} as const

export function buildListenLessonsTableColumns(options: {
  onOpen: (row: ListenLessonRow) => void
}): ColumnDef<ListenLessonRow>[] {
  return [
    adminTableSelectColumn<ListenLessonRow>(),
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
      accessorKey: "levelCode",
      header: "Level",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("levelCode")}</Badge>,
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
      cell: ({ row }) => {
        const published = row.getValue("isPublished") as boolean
        return (
          <Badge variant={published ? "default" : "secondary"}>
            {published ? "Publish" : "Draft"}
          </Badge>
        )
      },
      enableSorting: false,
    },
  ]
}
