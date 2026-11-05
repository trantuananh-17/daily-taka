"use client"

import type { ReactNode } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table/data-table"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import type { ListPageSize } from "@/lib/list-pagination"

/** Cấu hình lọc cột — pattern chung (Topic, Listen, …). */
export type AdminDataTableFilterConfig = {
  primary: { columnId: string; placeholder: string }
  secondary?: { columnId: string; placeholder: string }
}

export type AdminDataTablePanelProps<TData, TValue> = {
  title: string
  description?: ReactNode
  action?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filter: AdminDataTableFilterConfig
  pageSize?: ListPageSize
  onPageSizeChange?: (limit: ListPageSize) => void
}

/** Card + toolbar + bảng + pagination — dùng chung admin CMS. */
export function AdminDataTablePanel<TData, TValue>({
  title,
  description,
  action,
  columns,
  data,
  filter,
  pageSize,
  onPageSizeChange,
}: AdminDataTablePanelProps<TData, TValue>) {
  return (
    <DashboardPanel title={title} action={action}>
      {description ? <div className="mb-4 text-sm text-muted-foreground">{description}</div> : null}
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder={filter.primary.placeholder}
        searchColumnId={filter.primary.columnId}
        secondaryFilterPlaceholder={filter.secondary?.placeholder}
        secondaryFilterColumnId={filter.secondary?.columnId}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />
    </DashboardPanel>
  )
}
