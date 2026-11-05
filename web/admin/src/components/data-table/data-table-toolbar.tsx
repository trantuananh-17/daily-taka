"use client"

import type { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchColumnId?: string
  secondaryFilterPlaceholder?: string
  secondaryFilterColumnId?: string
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Lọc…",
  searchColumnId = "name",
  secondaryFilterPlaceholder = "Lọc slug…",
  secondaryFilterColumnId = "slug",
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Input
        placeholder={searchPlaceholder}
        value={(table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ""}
        onChange={(e) => table.getColumn(searchColumnId)?.setFilterValue(e.target.value)}
        className="h-8 w-full sm:max-w-xs"
      />
      <div className="flex items-center gap-2">
        <Input
          placeholder={secondaryFilterPlaceholder}
          value={(table.getColumn(secondaryFilterColumnId)?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn(secondaryFilterColumnId)?.setFilterValue(e.target.value)
          }
          className="h-8 w-full sm:w-[200px]"
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
