const viNumber = new Intl.NumberFormat("vi-VN")

export function formatCount(value: number): string {
  return viNumber.format(value)
}

export function formatDashboardTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

/** `2026-11-04` → `04/11` for chart axis */
export function formatChartDay(isoDate: string): string {
  const [, month, day] = isoDate.split("-")
  if (!month || !day) return isoDate
  return `${day}/${month}`
}
