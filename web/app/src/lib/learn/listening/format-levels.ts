const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
const HSK_ORDER = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8"] as const
/** Easiest → hardest for display range */
const JLPT_ORDER = ["N5", "N4", "N3", "N2", "N1"] as const

function levelSortOrder(level: string, order: readonly string[]): number {
  const index = order.indexOf(level as (typeof order)[number])
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

function detectLevelOrder(levels: string[]): readonly string[] {
  if (levels.some((level) => level.startsWith("HSK"))) {
    return HSK_ORDER
  }
  if (levels.some((level) => /^N\d$/.test(level))) {
    return JLPT_ORDER
  }
  return CEFR_ORDER
}

export function formatLevelRange(levels: string[]): string {
  if (levels.length === 0) {
    return "Mọi trình độ"
  }
  const order = detectLevelOrder(levels)
  const sorted = [...levels].sort(
    (a, b) => levelSortOrder(a, order) - levelSortOrder(b, order) || a.localeCompare(b),
  )
  if (sorted.length === 1) {
    return sorted[0]
  }
  return `${sorted[0]}–${sorted[sorted.length - 1]}`
}
