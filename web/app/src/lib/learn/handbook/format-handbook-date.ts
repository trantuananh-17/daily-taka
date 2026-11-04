/** `YYYY-MM-DD` → e.g. `27 thg 8, 2026` */
export function formatHandbookPublishedAt(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number)
  if (!y || !m || !d) return isoDate
  const date = new Date(Date.UTC(y, m - 1, d))
  const day = date.getUTCDate()
  const month = date.getUTCMonth() + 1
  return `${day} thg ${month}, ${y}`
}
