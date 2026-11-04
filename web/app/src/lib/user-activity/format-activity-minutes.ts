/** Compact label for pills and cells, e.g. `0m`, `1p`, `15p`. */
export function formatActivityMinutesShort(minutes: number, variant: "pill" | "cell" = "pill"): string {
  const rounded = Math.max(0, Math.floor(minutes))
  if (rounded === 0) return variant === "pill" ? "0m" : ""
  const suffix = variant === "cell" ? "p" : "m"
  if (rounded >= 60) {
    const h = Math.floor(rounded / 60)
    const m = rounded % 60
    return m > 0 ? `${h}h ${m}${suffix}` : `${h}h`
  }
  return `${rounded}${suffix}`
}
