const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"] as const

export function formatLevelRange(levels: string[]): string {
  if (levels.length === 0) return "—"
  const sorted = [...levels].sort(
    (a, b) => LEVEL_ORDER.indexOf(a as (typeof LEVEL_ORDER)[number]) - LEVEL_ORDER.indexOf(b as (typeof LEVEL_ORDER)[number]),
  )
  const first = sorted[0]!
  const last = sorted[sorted.length - 1]!
  if (first === last) return first
  return `${first}–${last}`
}

export const LISTEN_LEVEL_OPTIONS = [...LEVEL_ORDER]
