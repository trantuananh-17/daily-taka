import { DashboardKpiStatCard } from "@/features/dashboard/components/dashboard-kpi-stat-card"
import type { AdminDashboardKpiCard } from "@/lib/admin-dashboard/types"

type DashboardKpiRowProps = {
  kpis: AdminDashboardKpiCard[]
}

export function DashboardKpiRow({ kpis }: DashboardKpiRowProps) {
  return (
    <section aria-labelledby="dashboard-kpis">
      <h3 id="dashboard-kpis" className="sr-only">
        Chỉ số tổng quan
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <DashboardKpiStatCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </section>
  )
}
