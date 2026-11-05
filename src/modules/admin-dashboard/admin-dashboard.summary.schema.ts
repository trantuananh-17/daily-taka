import { z } from "zod"

/** Contract: JSON body of `GET /v1/admin/dashboard/summary` — source of truth for admin dashboard data. */
export const ADMIN_DASHBOARD_LANGUAGE_CODES = ["en", "zh", "jp"] as const

export const adminDashboardLanguageCodeSchema = z.enum(ADMIN_DASHBOARD_LANGUAGE_CODES)

export const listenContentStatsSchema = z.object({
  categories: z.number().int().nonnegative(),
  sections: z.number().int().nonnegative(),
  lessonsPublished: z.number().int().nonnegative(),
  lessonsDraft: z.number().int().nonnegative(),
  lessonsMissingAudio: z.number().int().nonnegative(),
})

export const vocabContentStatsSchema = z.object({
  levels: z.number().int().nonnegative(),
  lessons: z.number().int().nonnegative(),
  words: z.number().int().nonnegative(),
})

export const writingContentStatsSchema = z.object({
  lessons: z.number().int().nonnegative(),
  sentences: z.number().int().nonnegative(),
})

export const languageDashboardSliceSchema = z.object({
  language: adminDashboardLanguageCodeSchema,
  label: z.string(),
  listen: listenContentStatsSchema,
  vocab: vocabContentStatsSchema.nullable(),
  writing: writingContentStatsSchema.nullable(),
})

export const adminDashboardGlobalStatsSchema = z.object({
  usersTotal: z.number().int().nonnegative(),
  usersActive7d: z.number().int().nonnegative(),
  progressEventsToday: z.number().int().nonnegative(),
  ticketsOpen: z.number().int().nonnegative(),
  ticketsInProgress: z.number().int().nonnegative(),
  apiErrors24h: z.number().int().nonnegative(),
  storageOk: z.boolean(),
})

export const adminDashboardActivityDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  listen: z.number().int().nonnegative(),
  vocab: z.number().int().nonnegative(),
  writing: z.number().int().nonnegative(),
})

export const adminDashboardLanguageModuleStatsSchema = z.object({
  listen: z.number().int().nonnegative(),
  vocab: z.number().int().nonnegative(),
  writing: z.number().int().nonnegative(),
})

export const adminDashboardLanguageModuleActivityDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  en: adminDashboardLanguageModuleStatsSchema,
  zh: adminDashboardLanguageModuleStatsSchema,
  jp: adminDashboardLanguageModuleStatsSchema,
})

export const adminDashboardAttentionKindSchema = z.enum([
  "draft",
  "missing_audio",
  "ticket",
  "api_error",
])

export const adminDashboardAttentionItemSchema = z.object({
  id: z.string(),
  kind: adminDashboardAttentionKindSchema,
  language: adminDashboardLanguageCodeSchema.nullable(),
  title: z.string(),
  href: z.string(),
})

export const adminDashboardCapabilitiesSchema = z.object({
  listen: z.array(adminDashboardLanguageCodeSchema),
  vocabDb: z.array(adminDashboardLanguageCodeSchema),
  writingDb: z.array(adminDashboardLanguageCodeSchema),
})

export const adminDashboardKpiGroupSchema = z.enum([
  "growth",
  "engagement",
  "monetization",
  "content",
])

export const adminDashboardKpiTrendSchema = z.object({
  direction: z.enum(["up", "down", "flat"]),
  /** Absolute percent change vs comparison period (e.g. 12 = +12%). */
  percent: z.number().nonnegative(),
  period: z.enum(["week", "month", "year"]),
  /** Short UI copy, e.g. "so với tuần trước" */
  compareLabel: z.string(),
})

export const adminDashboardKpiCardSchema = z.object({
  id: z.string(),
  group: adminDashboardKpiGroupSchema,
  label: z.string(),
  value: z.string(),
  trend: adminDashboardKpiTrendSchema.optional(),
  /** Last N periods (typically 7 daily points) for sparkline. */
  sparkline: z.array(z.number().nonnegative()).min(2).max(31),
})

export const adminDashboardLeaderboardEntrySchema = z.object({
  rank: z.number().int().positive(),
  userId: z.string(),
  displayName: z.string(),
  /** Learner XP / points earned this week (admin view). */
  pointsWeek: z.number().int().nonnegative(),
  minutesLearnedWeek: z.number().int().nonnegative(),
  /** Current streak in days (at week snapshot). */
  streakDays: z.number().int().nonnegative(),
  lessonsCompletedWeek: z.number().int().nonnegative(),
})

export const adminDashboardWeekdayDauSchema = z.object({
  /** 0 = Monday … 6 = Sunday (ISO weekday). */
  weekday: z.number().int().min(0).max(6),
  label: z.string(),
  dau: z.number().int().nonnegative(),
})

export const adminDashboardInsightsSchema = z.object({
  leaderboardWeek: z.array(adminDashboardLeaderboardEntrySchema).min(1).max(10),
  dauByWeekday: z.array(adminDashboardWeekdayDauSchema).length(7),
})

export const adminDashboardUserGrowthYearSchema = z.object({
  year: z.number().int(),
  usersTotal: z.number().int().nonnegative(),
})

export const adminDashboardDauMauMonthSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  label: z.string(),
  dau: z.number().int().nonnegative(),
  mau: z.number().int().nonnegative(),
})

export const adminDashboardCompletionsMonthSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  label: z.string(),
  total: z.number().int().nonnegative(),
})

export const adminDashboardTicketsMonthSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  label: z.string(),
  opened: z.number().int().nonnegative(),
  resolved: z.number().int().nonnegative(),
})

/** Long-range charts — monthly / yearly (tab Analytics). */
export const adminDashboardAnalyticsSchema = z.object({
  userGrowthByYear: z.array(adminDashboardUserGrowthYearSchema).min(2),
  dauMauByMonth: z.array(adminDashboardDauMauMonthSchema).min(2),
  lessonCompletionsByMonth: z.array(adminDashboardCompletionsMonthSchema).min(2),
  ticketsByMonth: z.array(adminDashboardTicketsMonthSchema).min(2),
})

export const adminDashboardSummarySchema = z.object({
  generatedAt: z.string().datetime(),
  global: adminDashboardGlobalStatsSchema,
  /** Top stat row — 4–6 KPIs with trend + sparkline. */
  kpis: z.array(adminDashboardKpiCardSchema).min(4).max(6),
  /** Quick tables + weekday DAU (push notification timing). */
  insights: adminDashboardInsightsSchema,
  /** Growth / engagement / ops trends (monthly & yearly). */
  analytics: adminDashboardAnalyticsSchema,
  byLanguage: z.array(languageDashboardSliceSchema),
  capabilities: adminDashboardCapabilitiesSchema,
  activity30d: z.array(adminDashboardActivityDaySchema),
  languageModuleActivity30d: z.array(adminDashboardLanguageModuleActivityDaySchema),
  attention: z.array(adminDashboardAttentionItemSchema),
})

export type AdminDashboardLanguageCode = z.infer<typeof adminDashboardLanguageCodeSchema>
export type ListenContentStats = z.infer<typeof listenContentStatsSchema>
export type VocabContentStats = z.infer<typeof vocabContentStatsSchema>
export type WritingContentStats = z.infer<typeof writingContentStatsSchema>
export type LanguageDashboardSlice = z.infer<typeof languageDashboardSliceSchema>
export type AdminDashboardGlobalStats = z.infer<typeof adminDashboardGlobalStatsSchema>
export type AdminDashboardActivityDay = z.infer<typeof adminDashboardActivityDaySchema>
export type AdminDashboardLanguageModuleStats = z.infer<
  typeof adminDashboardLanguageModuleStatsSchema
>
export type AdminDashboardLanguageModuleActivityDay = z.infer<
  typeof adminDashboardLanguageModuleActivityDaySchema
>
export type AdminDashboardAttentionKind = z.infer<typeof adminDashboardAttentionKindSchema>
export type AdminDashboardAttentionItem = z.infer<typeof adminDashboardAttentionItemSchema>
export type AdminDashboardCapabilities = z.infer<typeof adminDashboardCapabilitiesSchema>
export type AdminDashboardKpiGroup = z.infer<typeof adminDashboardKpiGroupSchema>
export type AdminDashboardKpiTrend = z.infer<typeof adminDashboardKpiTrendSchema>
export type AdminDashboardKpiCard = z.infer<typeof adminDashboardKpiCardSchema>
export type AdminDashboardLeaderboardEntry = z.infer<typeof adminDashboardLeaderboardEntrySchema>
export type AdminDashboardWeekdayDau = z.infer<typeof adminDashboardWeekdayDauSchema>
export type AdminDashboardInsights = z.infer<typeof adminDashboardInsightsSchema>
export type AdminDashboardAnalytics = z.infer<typeof adminDashboardAnalyticsSchema>
export type AdminDashboardSummary = z.infer<typeof adminDashboardSummarySchema>
