import { DashboardLearnerActivitySection } from "@/features/dashboard/dashboard-learner-activity-section"
import { DashboardAttentionTable } from "@/features/dashboard/dashboard-attention-table"
import { DashboardKpiRow } from "@/features/dashboard/dashboard-kpi-row"
import { DashboardLanguageTable } from "@/features/dashboard/dashboard-language-table"
import { DashboardLeaderboardPanel } from "@/features/dashboard/dashboard-leaderboard-panel"
import { DashboardQuickLinks } from "@/features/dashboard/dashboard-quick-links"
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header"
import type { AdminDashboardSummary } from "@/lib/admin-dashboard/types"

type AdminDashboardViewProps = {
  summary: AdminDashboardSummary
}

export function AdminDashboardView({ summary }: AdminDashboardViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <DashboardPageHeader generatedAt={summary.generatedAt} />

      <DashboardKpiRow kpis={summary.kpis} />

      <section aria-labelledby="dashboard-charts">
        <h3 id="dashboard-charts" className="sr-only">
          Lượt học theo module
        </h3>
        <DashboardLearnerActivitySection
          byLanguage={summary.byLanguage}
          activity30d={summary.activity30d}
          languageModuleActivity30d={summary.languageModuleActivity30d}
        />
      </section>

      <section aria-labelledby="dashboard-ops" className="grid gap-4 lg:grid-cols-2">
        <h3 id="dashboard-ops" className="sr-only">
          Vận hành
        </h3>
        <DashboardLeaderboardPanel rows={summary.insights.leaderboardWeek} />
        <DashboardAttentionTable items={summary.attention} />
      </section>

      <DashboardQuickLinks />

      <DashboardLanguageTable rows={summary.byLanguage} />
    </div>
  )
}
