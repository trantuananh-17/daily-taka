import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import { DashboardWeekdayDauChart } from "@/features/dashboard/components/dashboard-weekday-dau-chart"
import { DashboardLeaderboardPanel } from "@/features/dashboard/dashboard-leaderboard-panel"
import type { AdminDashboardInsights } from "@/lib/admin-dashboard/types"

type DashboardInsightsRowProps = {
  insights: AdminDashboardInsights
}

export function DashboardInsightsRow({ insights }: DashboardInsightsRowProps) {
  return (
    <section aria-labelledby="dashboard-insights" className="grid gap-4 lg:grid-cols-2">
      <h3 id="dashboard-insights" className="sr-only">
        Tương tác tuần
      </h3>
      <DashboardLeaderboardPanel rows={insights.leaderboardWeek} />
      <DashboardPanel title="DAU theo ngày trong tuần">
        <DashboardWeekdayDauChart rows={insights.dauByWeekday} />
      </DashboardPanel>
    </section>
  )
}
