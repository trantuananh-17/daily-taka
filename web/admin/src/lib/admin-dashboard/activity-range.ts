export type ActivityDateBounds = {
  min: string
  max: string
}

export function getActivityDateBounds(days: { date: string }[]): ActivityDateBounds {
  if (days.length === 0) {
    const today = new Date().toISOString().slice(0, 10)
    return { min: today, max: today }
  }
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  return { min: sorted[0]!.date, max: sorted[sorted.length - 1]!.date }
}

export function filterByDateRange<T extends { date: string }>(
  rows: T[],
  start: string,
  end: string,
): T[] {
  const [from, to] = start <= end ? [start, end] : [end, start]
  return rows
    .filter((row) => row.date >= from && row.date <= to)
    .sort((a, b) => a.date.localeCompare(b.date))
}
