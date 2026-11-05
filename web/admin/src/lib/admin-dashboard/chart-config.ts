import type { ChartConfig } from "@/components/ui/chart"

/** Chart cột xếp chồng — teal · cam · hồng (tham chiếu mock UI). */
export const MODULE_ACTIVITY_CHART_CONFIG = {
  listen: {
    label: "Listen",
    theme: { light: "#76d1d1", dark: "#8edede" },
  },
  vocab: {
    label: "Vocab",
    theme: { light: "#f4b16d", dark: "#ffc985" },
  },
  writing: {
    label: "Write",
    theme: { light: "#f1979a", dark: "#ffb3b5" },
  },
} satisfies ChartConfig

/** Pie tổng bài học — đỏ · vàng · cam. */
export const LANGUAGE_LESSONS_CHART_CONFIG = {
  en: {
    label: "English",
    theme: { light: "#e85656", dark: "#ff7a7a" },
  },
  zh: {
    label: "中文",
    theme: { light: "#f5c842", dark: "#ffdd6a" },
  },
  jp: {
    label: "日本語",
    theme: { light: "#f4a04a", dark: "#ffb86a" },
  },
} satisfies ChartConfig

/** Recharts 3: initial size must be > 0 or chart renders null until ResizeObserver. */
export const DASHBOARD_BAR_CHART_INITIAL = { width: 720, height: 280 } as const
export const DASHBOARD_PIE_CHART_INITIAL = { width: 280, height: 280 } as const
