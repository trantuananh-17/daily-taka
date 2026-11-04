import { STREAK_GOAL_MINUTES } from "@/lib/user-activity/constants"
import {
  buildRollingDailyRange,
  computeCurrentStreak,
  computeLongestStreak,
} from "@/lib/user-activity/streak"
import type { ActivityDashboardData, DailyActivity } from "@/lib/user-activity/types"

/** Demo anchor matches screenshot: Nov 2026, today = 4th with 1 minute. */
const MOCK_TODAY = "2026-11-04"
const MOCK_YEAR = 2026

function seedYearDays(): DailyActivity[] {
  const days: DailyActivity[] = []
  for (let month = 1; month <= 12; month += 1) {
    const lastDay = new Date(Date.UTC(MOCK_YEAR, month, 0)).getUTCDate()
    for (let d = 1; d <= lastDay; d += 1) {
      const date = `${MOCK_YEAR}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      let activeMinutes = 0
      if (date === MOCK_TODAY) activeMinutes = 1
      else if (date === "2026-11-03") activeMinutes = 8
      else if (date === "2026-10-28") activeMinutes = 22
      else if (date === "2026-10-27") activeMinutes = 18
      else if (date === "2026-10-26") activeMinutes = 45
      else if (date === "2026-08-15") activeMinutes = 75
      days.push({ date, activeMinutes })
    }
  }
  return days
}

const YEAR_DAYS = seedYearDays()

function sliceLast30(): DailyActivity[] {
  const range = buildRollingDailyRange(MOCK_TODAY, 30)
  const map = new Map(YEAR_DAYS.map((d) => [d.date, d.activeMinutes]))
  return range.map((date) => ({ date, activeMinutes: map.get(date) ?? 0 }))
}

export function getMockActivityTodayIso(): string {
  return MOCK_TODAY
}

export function getMockActivityDashboard(): ActivityDashboardData {
  const last30Days = sliceLast30()
  const todayMinutes = last30Days.find((d) => d.date === MOCK_TODAY)?.activeMinutes ?? 0
  const currentStreak = computeCurrentStreak(YEAR_DAYS, MOCK_TODAY)
  const longestStreak = computeLongestStreak(YEAR_DAYS)

  return {
    year: MOCK_YEAR,
    summary: {
      goalMinutes: STREAK_GOAL_MINUTES,
      todayMinutes,
      currentStreak,
      longestStreak,
    },
    last30Days,
    yearDays: YEAR_DAYS,
  }
}
