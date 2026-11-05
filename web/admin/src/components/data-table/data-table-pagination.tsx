"use client"

import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DEFAULT_LIST_PAGE_SIZE,
  LIST_PAGE_SIZE_OPTIONS,
  type ListPageSize,
} from "@/lib/list-pagination"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  pageSizeOptions?: readonly ListPageSize[]
  onPageSizeChange?: (limit: ListPageSize) => void
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = LIST_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  const selected = table.getFilteredSelectedRowModel().rows.length
  const total = table.getFilteredRowModel().rows.length
  const pageSize = table.getState().pagination.pageSize

  function handleLimitChange(value: string | null) {
    if (!value) return
    const limit = Number(value) as ListPageSize
    table.setPageSize(limit)
    table.setPageIndex(0)
    onPageSizeChange?.(limit)
  }

  return (
    <div className="flex flex-col gap-3 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {selected} / {total} dòng được chọn
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={String(pageSize)} onValueChange={handleLimitChange}>
          <SelectTrigger className="h-8 w-[5.5rem]" aria-label="Số dòng mỗi trang">
            <SelectValue placeholder={String(DEFAULT_LIST_PAGE_SIZE)} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
