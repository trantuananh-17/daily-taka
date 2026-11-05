"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { adminTableSelectColumn } from "@/components/data-table/admin-table-columns"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { ListeningSection } from "@/features/listen/lib/listen-admin-api"

type ListenSectionTableRow = ListeningSection & {
  topicName?: string
  topicId?: string
  lessonCount?: number
}
import { cn } from "cn"

export const LISTEN_SECTIONS_TABLE_FILTER = {
  primary: { columnId: "title", placeholder: "Lọc tiêu đề chương…" },
  secondary: { columnId: "title", placeholder: "Lọc tiêu đề…" },
} as const

export function buildListenSectionsTableColumns(options: {
  onOpen: (row: ListenSectionTableRow) => void
}): ColumnDef<ListenSectionTableRow>[] {
  return [
    adminTableSelectColumn<ListenSectionTableRow>(),
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
      accessorKey: "sectionNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{row.getValue("sectionNumber")}</div>
      ),
    },
    {
      accessorKey: "sortOrder",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="sortOrder" />
      ),
      cell: ({ row }) => <span className="tabular-nums">{row.getValue("sortOrder")}</span>,
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
      accessorKey: "access",
      header: "Access",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("access")}</Badge>,
      enableSorting: false,
    },
  ]
}
