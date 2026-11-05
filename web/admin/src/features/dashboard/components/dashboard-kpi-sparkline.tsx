"use client"

import { memo, useMemo } from "react"
import { Area, AreaChart } from "recharts"

import { ChartContainer } from "@/components/ui/chart"
import { DASHBOARD_GLASS_CHART_CLASS } from "@/features/dashboard/components/dashboard-chart-glass"
import { cn } from "cn"

const SPARKLINE_CONFIG = {
  value: { label: "Trend", color: "var(--dlx-chart-module-listen)" },
} as const

type DashboardKpiSparklineProps = {
  points: number[]
  variant?: "inline" | "backdrop"
}

export const DashboardKpiSparkline = memo(function DashboardKpiSparkline({
  points,
  variant = "inline",
}: DashboardKpiSparklineProps) {
  const data = useMemo(
    () => points.map((value, index) => ({ index, value })),
    [points],
  )

  if (variant === "backdrop") {
    return (
      <ChartContainer
        config={SPARKLINE_CONFIG}
        initialDimension={{ width: 320, height: 88 }}
        className={cn(
          DASHBOARD_GLASS_CHART_CLASS,
          "pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-90",
        )}
      >
        <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            fill="var(--color-value)"
            fillOpacity={0.08}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      config={SPARKLINE_CONFIG}
      initialDimension={{ width: 96, height: 52 }}
      className={cn(DASHBOARD_GLASS_CHART_CLASS, "h-[52px] w-24 shrink-0")}
    >
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          fill="var(--color-value)"
          fillOpacity={0.12}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
})
