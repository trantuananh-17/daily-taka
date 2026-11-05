/**
 * Admin dashboard DTO — re-export from Hono contract (Zod).
 * @see src/modules/admin-dashboard/admin-dashboard.summary.schema.ts
 * @see docs/design/2026-11-05-admin-dashboard-data.md
 */
export {
  ADMIN_DASHBOARD_LANGUAGE_CODES,
  adminDashboardSummarySchema,
} from "@dailytaka/admin-dashboard-contract"

export type {
  AdminDashboardActivityDay,
  AdminDashboardAttentionItem,
  AdminDashboardAttentionKind,
  AdminDashboardCapabilities,
  AdminDashboardAnalytics,
  AdminDashboardGlobalStats,
  AdminDashboardInsights,
  AdminDashboardKpiCard,
  AdminDashboardLeaderboardEntry,
  AdminDashboardKpiGroup,
  AdminDashboardKpiTrend,
  AdminDashboardLanguageCode,
  AdminDashboardLanguageModuleActivityDay,
  AdminDashboardLanguageModuleStats,
  AdminDashboardSummary,
  AdminDashboardWeekdayDau,
  LanguageDashboardSlice,
  ListenContentStats,
  VocabContentStats,
  WritingContentStats,
} from "@dailytaka/admin-dashboard-contract"
