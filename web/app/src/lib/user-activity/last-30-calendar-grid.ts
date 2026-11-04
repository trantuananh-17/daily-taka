import { dayOfMonth, isoWeekdayMon0 } from "@/lib/user-activity/streak"
import type { CalendarDayCell, DailyActivity } from "@/lib/user-activity/types"

/** Place last N days into Mon–Sun columns (row-major). */
export function buildLast30CalendarGrid(days: DailyActivity[]): CalendarDayCell[][] {
  if (days.length === 0) return []
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0].date
  const leadPadding = isoWeekdayMon0(first)

  const cells: CalendarDayCell[] = []
  for (let i = 0; i < leadPadding; i += 1) {
    cells.push({ date: "", dayOfMonth: 0, activeMinutes: 0, isPadding: true })
  }
  for (const d of sorted) {
    cells.push({
      date: d.date,
      dayOfMonth: dayOfMonth(d.date),
      activeMinutes: d.activeMinutes,
      isPadding: false,
    })
  }

  const rows: CalendarDayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  const lastRow = rows[rows.length - 1]
  if (lastRow && lastRow.length < 7) {
    while (lastRow.length < 7) {
      lastRow.push({ date: "", dayOfMonth: 0, activeMinutes: 0, isPadding: true })
    }
  }
  return rows
}
