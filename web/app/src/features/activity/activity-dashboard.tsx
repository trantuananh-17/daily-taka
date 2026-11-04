import { ActivityLast30DaysCard } from "@/features/activity/activity-last-30-days-card"
import { ActivityStatPills } from "@/features/activity/activity-stat-pills"
import { ActivityYearHeatmapCard } from "@/features/activity/activity-year-heatmap-card"
import type { ActivityDashboardData } from "@/lib/user-activity/types"

type ActivityDashboardProps = {
  data: ActivityDashboardData
}

export function ActivityDashboard({ data }: ActivityDashboardProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--dlx-ink)] sm:text-3xl">Lộ trình học</h1>
          <p className="mt-1 font-body text-sm text-[var(--dlx-muted)]">
            Mỗi ngày học đủ {data.summary.goalMinutes} phút được tính 1 ngày streak.
          </p>
        </div>
        <ActivityStatPills summary={data.summary} />
      </div>
      <ActivityLast30DaysCard days={data.last30Days} summary={data.summary} />
      <ActivityYearHeatmapCard year={data.year} days={data.yearDays} />
    </div>
  )
}
