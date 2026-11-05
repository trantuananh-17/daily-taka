"use client"

import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { DashboardKpiSparkline } from "@/features/dashboard/components/dashboard-kpi-sparkline"
import type { AdminDashboardKpiCard } from "@/lib/admin-dashboard/types"
import { cn } from "cn"

function trendSentiment(kpi: AdminDashboardKpiCard): "good" | "bad" | "neutral" {
  const trend = kpi.trend
  if (!trend || trend.direction === "flat") return "neutral"
  if (kpi.id === "support_open") {
    return trend.direction === "down" ? "good" : "bad"
  }
  return trend.direction === "up" ? "good" : "bad"
}

function TrendBadge({ kpi }: { kpi: AdminDashboardKpiCard }) {
  const trend = kpi.trend
  if (!trend) return null

  const sentiment = trendSentiment(kpi)
  const Icon =
    trend.direction === "up"
      ? TrendingUpIcon
      : trend.direction === "down"
        ? TrendingDownIcon
        : MinusIcon

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
        sentiment === "good" && "bg-[color-mix(in_srgb,var(--dlx-primary)_12%,transparent)] text-[var(--dlx-link)]",
        sentiment === "bad" && "bg-destructive/10 text-destructive",
        sentiment === "neutral" && "bg-muted text-muted-foreground",
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      <span>{trend.percent}%</span>
    </div>
  )
}

type DashboardKpiStatCardProps = {
  kpi: AdminDashboardKpiCard
}

export function DashboardKpiStatCard({ kpi }: DashboardKpiStatCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-stretch gap-3 pb-4 pt-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
            <TrendBadge kpi={kpi} />
          </div>
          <p className="font-heading text-2xl font-semibold leading-none tracking-tight tabular-nums">
            {kpi.value}
          </p>
          {kpi.trend ? (
            <p className="mt-1.5 text-[11px] text-muted-foreground">{kpi.trend.compareLabel}</p>
          ) : null}
        </div>
        <DashboardKpiSparkline points={kpi.sparkline} variant="inline" />
      </CardContent>
    </Card>
  )
}
