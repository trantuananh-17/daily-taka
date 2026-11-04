import { STREAK_GOAL_MINUTES } from "@/lib/user-activity/constants"
import type { DailyActivity, Last30DaysStats } from "@/lib/user-activity/types"

function minutesByDate(days: DailyActivity[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const d of days) {
    map.set(d.date, d.activeMinutes)
  }
  return map
}

function addDays(isoDate: string, delta: number): string {
  const [y, m, d] = isoDate.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + delta))
  return dt.toISOString().slice(0, 10)
}

function isQualified(minutes: number, goalMinutes: number): boolean {
  return Math.floor(minutes) >= goalMinutes
}

/** Consecutive qualified days ending today (if today qualifies) or yesterday otherwise. */
export function computeCurrentStreak(
  days: DailyActivity[],
  todayIso: string,
  goalMinutes = STREAK_GOAL_MINUTES,
): number {
  const map = minutesByDate(days)
  let cursor = todayIso
  const todayMin = map.get(todayIso) ?? 0
  if (!isQualified(todayMin, goalMinutes)) {
    cursor = addDays(todayIso, -1)
  }

  let streak = 0
  while (isQualified(map.get(cursor) ?? 0, goalMinutes)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function computeLongestStreak(
  days: DailyActivity[],
  goalMinutes = STREAK_GOAL_MINUTES,
): number {
  if (days.length === 0) return 0
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  let longest = 0
  let run = 0
  let prevDate: string | null = null

  for (const day of sorted) {
    if (!isQualified(day.activeMinutes, goalMinutes)) {
      run = 0
      prevDate = day.date
      continue
    }
    if (prevDate && addDays(prevDate, 1) === day.date && run > 0) {
      run += 1
    } else {
      run = 1
    }
    longest = Math.max(longest, run)
    prevDate = day.date
  }
  return longest
}

export function summarizeLast30Days(
  days: DailyActivity[],
  goalMinutes = STREAK_GOAL_MINUTES,
): Last30DaysStats {
  let daysWithAnyStudy = 0
  let daysQualified = 0
  let daysUnderGoal = 0
  for (const d of days) {
    const m = Math.floor(d.activeMinutes)
    if (m === 0) continue
    daysWithAnyStudy += 1
    if (m >= goalMinutes) daysQualified += 1
    else daysUnderGoal += 1
  }
  return { daysWithAnyStudy, daysQualified, daysUnderGoal }
}

export function buildRollingDailyRange(endIso: string, count: number): string[] {
  const out: string[] = []
  for (let i = count - 1; i >= 0; i -= 1) {
    out.push(addDays(endIso, -i))
  }
  return out
}

/** Monday = 0 … Sunday = 6 (ISO weekday). */
export function isoWeekdayMon0(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number)
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return dow === 0 ? 6 : dow - 1
}

export function dayOfMonth(isoDate: string): number {
  return Number(isoDate.split("-")[2])
}
