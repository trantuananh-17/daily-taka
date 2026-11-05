"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { adminTableSelectColumn } from "@/components/data-table/admin-table-columns"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { TopicRow } from "@/features/topics/lib/topics-mock"

export const TOPICS_TABLE_FILTER = {
  primary: { columnId: "name", placeholder: "Lọc theo tên…" },
  secondary: { columnId: "slug", placeholder: "Lọc slug…" },
} as const

export function buildTopicsTableColumns(): ColumnDef<TopicRow>[] {
  return [
    adminTableSelectColumn<TopicRow>(),
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tên" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("slug")}</span>
      ),
    },
    {
      accessorKey: "isPublished",
      header: "Trạng thái",
      cell: ({ row }) => {
        const published = row.getValue("isPublished") as boolean
        return (
          <Badge variant={published ? "default" : "secondary"}>
            {published ? "Publish" : "Ẩn"}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const topic = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="size-8" aria-label="Thao tác" />
              }
            >
              <MoreHorizontalIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuItem>Sửa {topic.name} (mock)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Xóa (mock)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
