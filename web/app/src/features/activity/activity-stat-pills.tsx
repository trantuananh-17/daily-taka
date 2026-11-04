import { cn } from "cn"

import { formatActivityMinutesShort } from "@/lib/user-activity/format-activity-minutes"
import type { ActivitySummary } from "@/lib/user-activity/types"

type ActivityStatPillsProps = {
  summary: ActivitySummary
  className?: string
}

export function ActivityStatPills({ summary, className }: ActivityStatPillsProps) {
  const timeLabel = formatActivityMinutesShort(summary.todayMinutes, "pill")

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-[#d8dce8] bg-[#f5f6fa] px-3 py-1.5 font-heading text-sm font-bold text-[var(--dlx-ink)]"
        title="Thời gian học hôm nay"
      >
        <span aria-hidden>⏱️</span>
        {timeLabel}
      </span>
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-[#f5d0a8] bg-[#fff8eb] px-3 py-1.5 font-heading text-sm font-bold text-[#c2410c]"
        title={`Streak: ${summary.goalMinutes} phút mỗi ngày`}
      >
        <span aria-hidden>🔥</span>
        {summary.currentStreak}
      </span>
    </div>
  )
}
