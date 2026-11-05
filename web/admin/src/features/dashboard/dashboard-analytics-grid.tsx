"use client"

import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import {
  DASHBOARD_ANALYTICS_CHART_HEIGHT,
  DASHBOARD_GLASS_CHART_CLASS,
} from "@/features/dashboard/components/dashboard-chart-glass"
import { DASHBOARD_BAR_CHART_INITIAL } from "@/lib/admin-dashboard/chart-config"
import type { AdminDashboardAnalytics } from "@/lib/admin-dashboard/types"

const GROWTH_CONFIG = {
  usersTotal: { label: "Học viên", color: "var(--dlx-chart-lang-en)" },
} as const

const DAU_MAU_CONFIG = {
  dau: { label: "DAU", color: "var(--dlx-chart-module-listen)" },
  mau: { label: "MAU", color: "var(--dlx-chart-module-vocab)" },
} as const

const COMPLETIONS_CONFIG = {
  total: { label: "Bài hoàn thành", color: "var(--dlx-chart-module-writing)" },
} as const

const TICKETS_CONFIG = {
  opened: { label: "Mở", color: "var(--dlx-chart-lang-en)" },
  resolved: { label: "Đóng", color: "var(--dlx-chart-module-listen)" },
} as const

function GlassChartWrap({
  config,
  children,
}: {
  config: Record<string, { label: string; color: string }>
  children: ReactNode
}) {
  return (
    <ChartContainer
      config={config}
      initialDimension={DASHBOARD_BAR_CHART_INITIAL}
      className={`${DASHBOARD_GLASS_CHART_CLASS} aspect-auto w-full`}
      style={{ height: DASHBOARD_ANALYTICS_CHART_HEIGHT }}
    >
      {children}
    </ChartContainer>
  )
}

type DashboardAnalyticsGridProps = {
  analytics: AdminDashboardAnalytics
}

export function DashboardAnalyticsGrid({ analytics }: DashboardAnalyticsGridProps) {
  const growthRows = analytics.userGrowthByYear.map((r) => ({
    label: String(r.year),
    usersTotal: r.usersTotal,
  }))

  return (
    <section aria-labelledby="dashboard-analytics" className="space-y-4">
      <h3 id="dashboard-analytics" className="font-heading text-base font-semibold">
        Xu hướng dài hạn
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardPanel title="Tăng trưởng học viên · theo năm">
          <GlassChartWrap config={GROWTH_CONFIG}>
            <BarChart data={growthRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="usersTotal"
                fill="var(--color-usersTotal)"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
                isAnimationActive={false}
              />
            </BarChart>
          </GlassChartWrap>
        </DashboardPanel>

        <DashboardPanel title="DAU / MAU · theo tháng">
          <GlassChartWrap config={DAU_MAU_CONFIG}>
            <LineChart data={analytics.dauMauByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="dau"
                stroke="var(--color-dau)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="mau"
                stroke="var(--color-mau)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </GlassChartWrap>
        </DashboardPanel>

        <DashboardPanel title="Số bài hoàn thành · theo tháng">
          <GlassChartWrap config={COMPLETIONS_CONFIG}>
            <BarChart
              data={analytics.lessonCompletionsByMonth}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                isAnimationActive={false}
              />
            </BarChart>
          </GlassChartWrap>
        </DashboardPanel>

        <DashboardPanel title="Ticket · theo tháng">
          <GlassChartWrap config={TICKETS_CONFIG}>
            <BarChart data={analytics.ticketsByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="opened" stackId="t" fill="var(--color-opened)" maxBarSize={40} isAnimationActive={false} />
              <Bar
                dataKey="resolved"
                stackId="t"
                fill="var(--color-resolved)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                isAnimationActive={false}
              />
            </BarChart>
          </GlassChartWrap>
        </DashboardPanel>
      </div>
    </section>
  )
}
