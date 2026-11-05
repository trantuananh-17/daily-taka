"use client"

import { memo } from "react"
import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import {
  DASHBOARD_PIE_CHART_INITIAL,
  LANGUAGE_LESSONS_CHART_CONFIG,
} from "@/lib/admin-dashboard/chart-config"
import type { LanguageActivitySlice } from "@/lib/admin-dashboard/selectors"

type DashboardLanguageLessonsPieChartProps = {
  slices: LanguageActivitySlice[]
  className?: string
}

export const DashboardLanguageLessonsPieChart = memo(function DashboardLanguageLessonsPieChart({
  slices,
  className,
}: DashboardLanguageLessonsPieChartProps) {
  const total = slices.reduce((sum, row) => sum + row.value, 0)

  return (
    <DashboardPanel className={className} title="Tổng bài học theo ngôn ngữ">
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Chưa có bài học trong dữ liệu.</p>
      ) : (
        <ChartContainer
          config={LANGUAGE_LESSONS_CHART_CONFIG}
          initialDimension={DASHBOARD_PIE_CHART_INITIAL}
          className="mx-auto h-[280px] w-[280px] min-h-[280px] shrink-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="language" />} />
            <ChartLegend
              content={<ChartLegendContent nameKey="language" className="text-xs leading-tight" />}
            />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="language"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={2}
              strokeWidth={1}
              isAnimationActive
              animationDuration={320}
              animationBegin={0}
            >
              {slices.map((entry) => (
                <Cell key={entry.language} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </DashboardPanel>
  )
})
