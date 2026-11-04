import { isoWeekdayMon0 } from "@/lib/user-activity/streak"
import type { DailyActivity } from "@/lib/user-activity/types"

export type HeatmapDayCell = {
  date: string | null
  activeMinutes: number
}

export type HeatmapWeekColumn = {
  /** Week start date for label (optional) */
  weekStart: string | null
  days: HeatmapDayCell[]
}

const MONTH_LABELS_VI = [
  "THG 1",
  "THG 2",
  "THG 3",
  "THG 4",
  "THG 5",
  "THG 6",
  "THG 7",
  "THG 8",
  "THG 9",
  "THG 10",
  "THG 11",
  "THG 12",
] as const

export function monthLabelForWeek(weekStartIso: string | null): string | null {
  if (!weekStartIso) return null
  const month = Number(weekStartIso.slice(5, 7))
  return MONTH_LABELS_VI[month - 1] ?? null
}

/** GitHub-style columns: each column is one week (Mon–Sun). */
export function buildYearHeatmapGrid(year: number, days: DailyActivity[]): HeatmapWeekColumn[] {
  const map = new Map(days.map((d) => [d.date, d.activeMinutes]))
  const start = `${year}-01-01`
  const end = `${year}-12-31`

  const allDates: string[] = []
  let cursor = start
  while (cursor <= end) {
    allDates.push(cursor)
    const [y, m, d] = cursor.split("-").map(Number)
    const next = new Date(Date.UTC(y, m - 1, d + 1))
    cursor = next.toISOString().slice(0, 10)
  }

  const columns: HeatmapWeekColumn[] = []
  let week: HeatmapDayCell[] = []

  const padStart = isoWeekdayMon0(start)
  for (let i = 0; i < padStart; i += 1) {
    week.push({ date: null, activeMinutes: 0 })
  }

  for (const date of allDates) {
    week.push({ date, activeMinutes: map.get(date) ?? 0 })
    if (week.length === 7) {
      const firstReal = week.find((c) => c.date)?.date ?? null
      columns.push({ weekStart: firstReal, days: week })
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push({ date: null, activeMinutes: 0 })
    const firstReal = week.find((c) => c.date)?.date ?? null
    columns.push({ weekStart: firstReal, days: week })
  }

  return columns
}

/** Month labels at column indices where month changes (for top axis). */
export function heatmapMonthMarkers(columns: HeatmapWeekColumn[]): { colIndex: number; label: string }[] {
  const markers: { colIndex: number; label: string }[] = []
  let lastMonth: string | null = null
  columns.forEach((col, colIndex) => {
    const label = monthLabelForWeek(col.weekStart)
    if (!label || !col.weekStart) return
    const monthKey = col.weekStart.slice(0, 7)
    if (monthKey !== lastMonth) {
      markers.push({ colIndex, label })
      lastMonth = monthKey
    }
  })
  return markers
}
