import type { HeatmapLevel } from "@/lib/user-activity/types"

export function minutesToHeatmapLevel(minutes: number): HeatmapLevel {
  const m = Math.max(0, Math.floor(minutes))
  if (m === 0) return 0
  if (m < 15) return 1
  if (m < 30) return 2
  if (m < 60) return 3
  return 4
}

export const HEATMAP_LEVEL_CLASS: Record<HeatmapLevel, string> = {
  0: "bg-[#eef0ea] border border-[#e4e6e0]",
  1: "bg-[#fef3c7] border border-[#fde68a]",
  2: "bg-[#bbf7d0] border border-[#86efac]",
  3: "bg-[#4ade80] border border-[#22c55e]",
  4: "bg-[#15803d] border border-[#166534]",
}

export type CalendarDayStatus = "none" | "studied_under" | "qualified"

export function calendarDayStatus(minutes: number, goalMinutes: number): CalendarDayStatus {
  const m = Math.max(0, Math.floor(minutes))
  if (m === 0) return "none"
  if (m >= goalMinutes) return "qualified"
  return "studied_under"
}

export const CALENDAR_STATUS_CLASS: Record<CalendarDayStatus, string> = {
  none: "bg-[#f4f5f2] border border-[#e8eae4] text-[rgb(160,160,152)]",
  studied_under: "bg-[#fef9c3] border-2 border-[#fbbf24] text-[var(--dlx-ink)]",
  qualified: "bg-[#dcfce7] border border-[#86efac] text-[var(--dlx-ink)]",
}
