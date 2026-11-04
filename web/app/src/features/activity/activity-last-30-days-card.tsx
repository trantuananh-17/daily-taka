import { Flame, Trophy } from "lucide-react"
import { cn } from "cn"

import { WEEKDAY_LABELS_VI } from "@/lib/user-activity/constants"
import { formatActivityMinutesShort } from "@/lib/user-activity/format-activity-minutes"
import {
  CALENDAR_STATUS_CLASS,
  calendarDayStatus,
} from "@/lib/user-activity/heatmap-level"
import { buildLast30CalendarGrid } from "@/lib/user-activity/last-30-calendar-grid"
import { summarizeLast30Days } from "@/lib/user-activity/streak"
import type { ActivitySummary, DailyActivity } from "@/lib/user-activity/types"

type ActivityLast30DaysCardProps = {
  days: DailyActivity[]
  summary: ActivitySummary
}

export function ActivityLast30DaysCard({ days, summary }: ActivityLast30DaysCardProps) {
  const stats = summarizeLast30Days(days, summary.goalMinutes)
  const rows = buildLast30CalendarGrid(days)

  return (
    <section className="rounded-2xl border border-[var(--dlx-hairline)] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-[var(--dlx-ink)]">30 ngày gần đây</h2>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-body text-sm">
            <span className="text-[var(--dlx-muted)]">{stats.daysWithAnyStudy} ngày có học</span>
            <span className="font-medium text-emerald-700">{stats.daysQualified} ngày đủ 15p</span>
            <span className="font-medium text-amber-700">{stats.daysUnderGoal} ngày dưới 15p</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-heading text-xs font-bold text-emerald-800">
            <Flame className="size-3.5" aria-hidden />
            {summary.currentStreak} ngày streak hiện tại
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] px-3 py-1.5 font-heading text-xs font-bold text-[var(--dlx-muted)]">
            <Trophy className="size-3.5 text-amber-600" aria-hidden />
            Kỷ lục: {summary.longestStreak} ngày
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[320px]">
          <div className="mb-2 grid grid-cols-7 gap-1.5">
            {WEEKDAY_LABELS_VI.map((label) => (
              <div
                key={label}
                className="text-center font-heading text-[10px] font-bold uppercase text-[var(--dlx-muted)]"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-1.5">
                {row.map((cell, cellIndex) => {
                  if (cell.isPadding) {
                    return <div key={cellIndex} className="aspect-square min-h-10 rounded-lg" aria-hidden />
                  }
                  const status = calendarDayStatus(cell.activeMinutes, summary.goalMinutes)
                  const minuteLabel =
                    cell.activeMinutes > 0
                      ? formatActivityMinutesShort(cell.activeMinutes, "cell")
                      : null
                  return (
                    <div
                      key={cell.date}
                      className={cn(
                        "flex aspect-square min-h-10 flex-col items-center justify-center rounded-lg text-center",
                        CALENDAR_STATUS_CLASS[status],
                      )}
                      title={`${cell.date}: ${cell.activeMinutes} phút`}
                    >
                      <span className="font-heading text-xs font-bold">{cell.dayOfMonth}</span>
                      {minuteLabel ? (
                        <span className="font-heading text-[10px] font-bold text-amber-800">{minuteLabel}</span>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-body text-xs text-[var(--dlx-muted)]">
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[#dcfce7] border border-[#86efac]" aria-hidden />
          Đủ 15 phút (tính streak)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[#fef9c3] border-2 border-[#fbbf24]" aria-hidden />
          Có học nhưng dưới 15 phút (chưa đủ tính streak)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[#f4f5f2] border border-[#e8eae4]" aria-hidden />
          Chưa học
        </li>
      </ul>
    </section>
  )
}
