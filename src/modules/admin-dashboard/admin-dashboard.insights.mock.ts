import type {
  AdminDashboardAnalytics,
  AdminDashboardInsights,
} from "./admin-dashboard.summary.schema"

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

export function buildMockDashboardInsights(): AdminDashboardInsights {
  return {
    leaderboardWeek: [
      {
        rank: 1,
        userId: "u-1",
        displayName: "Minh Anh",
        pointsWeek: 4200,
        minutesLearnedWeek: 284,
        streakDays: 12,
        lessonsCompletedWeek: 18,
      },
      {
        rank: 2,
        userId: "u-2",
        displayName: "Quang Huy",
        pointsWeek: 3680,
        minutesLearnedWeek: 241,
        streakDays: 9,
        lessonsCompletedWeek: 15,
      },
      {
        rank: 3,
        userId: "u-3",
        displayName: "Thu Hà",
        pointsWeek: 2950,
        minutesLearnedWeek: 198,
        streakDays: 7,
        lessonsCompletedWeek: 12,
      },
      {
        rank: 4,
        userId: "u-4",
        displayName: "Kenji T.",
        pointsWeek: 2610,
        minutesLearnedWeek: 176,
        streakDays: 5,
        lessonsCompletedWeek: 11,
      },
      {
        rank: 5,
        userId: "u-5",
        displayName: "Lan Chi",
        pointsWeek: 2280,
        minutesLearnedWeek: 152,
        streakDays: 4,
        lessonsCompletedWeek: 9,
      },
    ],
    dauByWeekday: [
      { weekday: 0, label: WEEKDAY_LABELS[0]!, dau: 142 },
      { weekday: 1, label: WEEKDAY_LABELS[1]!, dau: 156 },
      { weekday: 2, label: WEEKDAY_LABELS[2]!, dau: 148 },
      { weekday: 3, label: WEEKDAY_LABELS[3]!, dau: 151 },
      { weekday: 4, label: WEEKDAY_LABELS[4]!, dau: 138 },
      { weekday: 5, label: WEEKDAY_LABELS[5]!, dau: 89 },
      { weekday: 6, label: WEEKDAY_LABELS[6]!, dau: 72 },
    ],
  }
}

export function buildMockDashboardAnalytics(): AdminDashboardAnalytics {
  return {
    userGrowthByYear: [
      { year: 2023, usersTotal: 420 },
      { year: 2024, usersTotal: 780 },
      { year: 2025, usersTotal: 1284 },
    ],
    dauMauByMonth: [
      { month: "2026-05", label: "05/26", dau: 98, mau: 412 },
      { month: "2026-06", label: "06/26", dau: 105, mau: 438 },
      { month: "2026-07", label: "07/26", dau: 112, mau: 465 },
      { month: "2026-08", label: "08/26", dau: 118, mau: 490 },
      { month: "2026-09", label: "09/26", dau: 125, mau: 512 },
      { month: "2026-10", label: "10/26", dau: 131, mau: 538 },
      { month: "2026-11", label: "11/26", dau: 138, mau: 562 },
    ],
    lessonCompletionsByMonth: [
      { month: "2026-05", label: "05/26", total: 1820 },
      { month: "2026-06", label: "06/26", total: 1940 },
      { month: "2026-07", label: "07/26", total: 2105 },
      { month: "2026-08", label: "08/26", total: 2280 },
      { month: "2026-09", label: "09/26", total: 2410 },
      { month: "2026-10", label: "10/26", total: 2595 },
      { month: "2026-11", label: "11/26", total: 1124 },
    ],
    ticketsByMonth: [
      { month: "2026-05", label: "05/26", opened: 12, resolved: 11 },
      { month: "2026-06", label: "06/26", opened: 9, resolved: 10 },
      { month: "2026-07", label: "07/26", opened: 14, resolved: 13 },
      { month: "2026-08", label: "08/26", opened: 8, resolved: 9 },
      { month: "2026-09", label: "09/26", opened: 11, resolved: 10 },
      { month: "2026-10", label: "10/26", opened: 7, resolved: 8 },
      { month: "2026-11", label: "11/26", opened: 5, resolved: 4 },
    ],
  }
}
