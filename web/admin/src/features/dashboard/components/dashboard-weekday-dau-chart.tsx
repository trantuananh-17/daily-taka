"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  DASHBOARD_ANALYTICS_CHART_HEIGHT,
  DASHBOARD_GLASS_CHART_CLASS,
} from "@/features/dashboard/components/dashboard-chart-glass"
import { DASHBOARD_BAR_CHART_INITIAL } from "@/lib/admin-dashboard/chart-config"
import type { AdminDashboardWeekdayDau } from "@/lib/admin-dashboard/types"

const WEEKDAY_CHART_CONFIG = {
  dau: { label: "DAU", color: "var(--dlx-chart-module-listen)" },
  low: { label: "Thấp", color: "var(--dlx-chart-lang-en)" },
} as const

type DashboardWeekdayDauChartProps = {
  rows: AdminDashboardWeekdayDau[]
}

export function DashboardWeekdayDauChart({ rows }: DashboardWeekdayDauChartProps) {
  const minDau = useMemo(() => Math.min(...rows.map((r) => r.dau)), [rows])
  const lowestLabels = useMemo(
    () => rows.filter((r) => r.dau === minDau).map((r) => r.label),
    [rows, minDau],
  )

  return (
    <div className="space-y-2">
      {lowestLabels.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Thấp nhất:{" "}
          <span className="font-medium text-foreground">{lowestLabels.join(", ")}</span> — gợi ý
          push nhắc học
        </p>
      ) : null}
      <ChartContainer
        config={WEEKDAY_CHART_CONFIG}
        initialDimension={DASHBOARD_BAR_CHART_INITIAL}
        className={`${DASHBOARD_GLASS_CHART_CLASS} aspect-auto w-full`}
        style={{ height: DASHBOARD_ANALYTICS_CHART_HEIGHT }}
      >
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="dau" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false}>
            {rows.map((row) => (
              <Cell
                key={row.weekday}
                fill={row.dau === minDau ? "var(--color-low)" : "var(--color-dau)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
