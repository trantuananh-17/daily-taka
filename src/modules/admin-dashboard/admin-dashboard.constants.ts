export const ADMIN_DASHBOARD_LANGUAGE_CODES = ["en", "zh", "jp"] as const
export type AdminDashboardLanguageCode = (typeof ADMIN_DASHBOARD_LANGUAGE_CODES)[number]

export const ADMIN_DASHBOARD_LANGUAGE_LABELS: Record<AdminDashboardLanguageCode, string> = {
  en: "English",
  zh: "中文",
  jp: "日本語",
}

export const ACTIVITY_LOOKBACK_DAYS = 30
