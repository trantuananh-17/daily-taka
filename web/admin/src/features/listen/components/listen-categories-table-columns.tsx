"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { adminTableSelectColumn } from "@/components/data-table/admin-table-columns"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { formatLevelRange } from "@/features/listen/lib/format-level-range"
import type { ListeningCategory } from "@/features/listen/lib/listen-admin-api"
import { cn } from "cn"

export const LISTEN_CATEGORIES_TABLE_FILTER = {
  primary: { columnId: "name", placeholder: "Lọc tên chủ đề…" },
  secondary: { columnId: "slug", placeholder: "Lọc slug…" },
} as const

export function buildListenCategoriesTableColumns(options: {
  onOpen: (row: ListeningCategory) => void
}): ColumnDef<ListeningCategory>[] {
  return [
    adminTableSelectColumn<ListeningCategory>(),
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tên" />,
      cell: ({ row }) => (
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-auto max-w-md truncate p-0 text-left font-medium",
          )}
          onClick={() => options.onOpen(row.original)}
        >
          {row.getValue("name") as string}
        </button>
      ),
    },
    {
      id: "levels",
      header: "Trình độ",
      cell: ({ row }) => (
        <Badge variant="outline">{formatLevelRange(row.original.levels)}</Badge>
      ),
      enableSorting: false,
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
