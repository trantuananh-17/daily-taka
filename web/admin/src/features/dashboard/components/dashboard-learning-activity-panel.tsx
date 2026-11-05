"use client"

import { memo, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardDateRangeControls } from "@/features/dashboard/components/dashboard-date-range-controls"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import {
  DASHBOARD_BAR_CHART_INITIAL,
  MODULE_ACTIVITY_CHART_CONFIG,
} from "@/lib/admin-dashboard/chart-config"
import type { ActivityDateBounds } from "@/lib/admin-dashboard/activity-range"
import type { LanguageModuleDailyRow } from "@/lib/admin-dashboard/selectors"
import type { AdminDashboardLanguageCode } from "@/lib/admin-dashboard/types"

type DashboardLearningActivityPanelProps = {
  enRows: LanguageModuleDailyRow[]
  zhRows: LanguageModuleDailyRow[]
  jpRows: LanguageModuleDailyRow[]
  startDate: string
  endDate: string
  bounds: ActivityDateBounds
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  className?: string
}

const LANGUAGE_TABS: { id: AdminDashboardLanguageCode; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "zh", label: "CN" },
  { id: "jp", label: "JP" },
]

function hasModuleActivity(rows: LanguageModuleDailyRow[]): boolean {
  return rows.some((row) => row.listen > 0 || row.vocab > 0 || row.writing > 0)
}

const LanguageModuleBarChart = memo(function LanguageModuleBarChart({
  language,
  rows,
  emptyMessage,
}: {
  language: AdminDashboardLanguageCode
  rows: LanguageModuleDailyRow[]
  emptyMessage: string
}) {
  const stackId = `day-${language}`

  if (!hasModuleActivity(rows)) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>
    )
  }

  return (
    <ChartContainer
      config={MODULE_ACTIVITY_CHART_CONFIG}
      initialDimension={DASHBOARD_BAR_CHART_INITIAL}
      className="aspect-auto h-[280px] min-h-[280px] w-full min-w-0"
    >
      <BarChart
        accessibilityLayer
        data={rows}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          interval="preserveStartEnd"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="listen"
          stackId={stackId}
          fill="var(--color-listen)"
          maxBarSize={36}
          isAnimationActive
          animationDuration={280}
          animationBegin={0}
        />
        <Bar
          dataKey="vocab"
          stackId={stackId}
          fill="var(--color-vocab)"
          maxBarSize={36}
          isAnimationActive
          animationDuration={280}
          animationBegin={0}
        />
        <Bar
          dataKey="writing"
          stackId={stackId}
          fill="var(--color-writing)"
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
          isAnimationActive
          animationDuration={280}
          animationBegin={0}
        />
      </BarChart>
    </ChartContainer>
  )
})

export function DashboardLearningActivityPanel({
  enRows,
  zhRows,
  jpRows,
  startDate,
  endDate,
  bounds,
  onStartDateChange,
  onEndDateChange,
  className,
}: DashboardLearningActivityPanelProps) {
  const [language, setLanguage] = useState<AdminDashboardLanguageCode>("en")

  const rowsByLanguage: Record<AdminDashboardLanguageCode, LanguageModuleDailyRow[]> = useMemo(
    () => ({ en: enRows, zh: zhRows, jp: jpRows }),
    [enRows, zhRows, jpRows],
  )

  const activeLabel = LANGUAGE_TABS.find((t) => t.id === language)?.label ?? language
  const activeRows = rowsByLanguage[language]

  return (
    <Tabs
      value={language}
      onValueChange={(value) => setLanguage(value as AdminDashboardLanguageCode)}
      className={className}
    >
      <DashboardPanel
        title="Lượt học theo thời gian"
        action={
          <TabsList className="h-8">
            {LANGUAGE_TABS.map(({ id, label }) => (
              <TabsTrigger key={id} value={id} className="px-2.5 text-xs sm:text-sm">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        }
      >
        <div className="flex flex-col gap-4">
          <DashboardDateRangeControls
            idPrefix="learning-activity"
            compact
            startDate={startDate}
            endDate={endDate}
            bounds={bounds}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
          />

          <LanguageModuleBarChart
            key={language}
            language={language}
            rows={activeRows}
            emptyMessage={`Không có lượt học ${activeLabel} trong khoảng ngày đã chọn.`}
          />
        </div>
      </DashboardPanel>
    </Tabs>
  )
}
