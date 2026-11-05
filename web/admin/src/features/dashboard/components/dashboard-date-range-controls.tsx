"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ActivityDateBounds } from "@/lib/admin-dashboard/activity-range"

type DashboardDateRangeControlsProps = {
  startDate: string
  endDate: string
  bounds: ActivityDateBounds
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  /** Prefix for input ids when nested in a card */
  idPrefix?: string
  compact?: boolean
}

export function DashboardDateRangeControls({
  startDate,
  endDate,
  bounds,
  onStartDateChange,
  onEndDateChange,
  idPrefix = "activity",
  compact = false,
}: DashboardDateRangeControlsProps) {
  const fromId = `${idPrefix}-from`
  const toId = `${idPrefix}-to`
  const inputClass = compact
    ? "h-8 w-[8.75rem] text-xs tabular-nums"
    : "w-[9.5rem] tabular-nums"

  return (
    <div className="flex flex-wrap items-end gap-2 sm:gap-3">
      <div className="grid gap-1">
        <Label htmlFor={fromId} className="text-xs text-muted-foreground">
          Từ ngày
        </Label>
        <Input
          id={fromId}
          type="date"
          className={inputClass}
          min={bounds.min}
          max={bounds.max}
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor={toId} className="text-xs text-muted-foreground">
          Đến ngày
        </Label>
        <Input
          id={toId}
          type="date"
          className={inputClass}
          min={bounds.min}
          max={bounds.max}
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </div>
  )
}
