export type DailyActivity = {
  /** Local calendar date `YYYY-MM-DD` (user timezone). */
  date: string
  activeMinutes: number
}

export type ActivitySummary = {
  goalMinutes: number
  todayMinutes: number
  currentStreak: number
  longestStreak: number
}

export type Last30DaysStats = {
  daysWithAnyStudy: number
  daysQualified: number
  daysUnderGoal: number
}

export type CalendarDayCell = {
  date: string
  dayOfMonth: number
  activeMinutes: number
  /** empty padding before first day in grid */
  isPadding?: boolean
}

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4

export type ActivityDashboardData = {
  summary: ActivitySummary
  last30Days: DailyActivity[]
  yearDays: DailyActivity[]
  year: number
}
