import type {
  AdminDashboardActivityDay,
  AdminDashboardGlobalStats,
  AdminDashboardKpiCard,
  LanguageDashboardSlice,
} from "./admin-dashboard.summary.schema"

function sumDayEvents(day: AdminDashboardActivityDay): number {
  return day.listen + day.vocab + day.writing
}

function padSparkline(points: number[], minLen = 7): number[] {
  if (points.length >= minLen) return points.slice(-minLen)
  if (points.length === 0) return Array.from({ length: minLen }, () => 0)
  const out = [...points]
  while (out.length < minLen) {
    out.unshift(out[0] ?? 0)
  }
  return out
}

function lastSparkline(days: AdminDashboardActivityDay[], n = 7): number[] {
  return padSparkline(days.map(sumDayEvents), n)
}

function formatInt(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n)
}

/** Admin home stat row — 4 cards: Growth ×2, Engagement ×1, Content/Ops ×1. DAU/MAU → insights/analytics only. */
export function buildDashboardKpis(input: {
  global: AdminDashboardGlobalStats
  activity30d: AdminDashboardActivityDay[]
  byLanguage: LanguageDashboardSlice[]
}): AdminDashboardKpiCard[] {
  const { global, activity30d } = input
  const eventSparkline = lastSparkline(activity30d)
  const lessonsCompletedWeek = eventSparkline.reduce((a, b) => a + b, 0)

  const backlog = input.byLanguage.reduce(
    (acc, row) => {
      acc.draft += row.listen.lessonsDraft
      acc.missing += row.listen.lessonsMissingAudio
      return acc
    },
    { draft: 0, missing: 0 },
  )

  return [
    {
      id: "users_total",
      group: "growth",
      label: "Tổng học viên",
      value: formatInt(global.usersTotal),
      trend: {
        direction: "up",
        percent: 3.2,
        period: "month",
        compareLabel: "so với tháng trước",
      },
      sparkline: [1180, 1195, 1210, 1226, 1240, 1262, global.usersTotal],
    },
    {
      id: "users_new_week",
      group: "growth",
      label: "Học viên mới · tuần này",
      value: formatInt(48),
      trend: {
        direction: "up",
        percent: 12,
        period: "week",
        compareLabel: "so với tuần trước",
      },
      sparkline: [5, 8, 6, 9, 7, 10, 13],
    },
    {
      id: "lessons_completed_week",
      group: "engagement",
      label: "Bài hoàn thành · tuần",
      value: formatInt(lessonsCompletedWeek),
      trend: {
        direction: "up",
        percent: 8,
        period: "week",
        compareLabel: "so với tuần trước",
      },
      sparkline: eventSparkline.map((n) => Math.round(n * 0.35)),
    },
    {
      id: "support_open",
      group: "content",
      label: "Hỗ trợ chưa xử lý",
      value: formatInt(global.ticketsOpen),
      trend: {
        direction: global.ticketsOpen > 0 ? "down" : "flat",
        percent: global.ticketsOpen > 0 ? 25 : 0,
        period: "week",
        compareLabel:
          backlog.draft + backlog.missing > 0
            ? `${backlog.draft + backlog.missing} listen draft/audio`
            : "so với tuần trước",
      },
      sparkline: [5, 4, 6, 3, 4, 2, global.ticketsOpen],
    },
  ]
}
