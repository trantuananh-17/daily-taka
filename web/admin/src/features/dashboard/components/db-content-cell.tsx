import { Badge } from "@/components/ui/badge"

type DbContentCellProps = {
  summary: string | null
  mockLabel?: string
}

/** Vocab / writing: số từ DB hoặc badge mock (ZH/JP). */
export function DbContentCell({ summary, mockLabel = "Mock FE" }: DbContentCellProps) {
  if (!summary) {
    return (
      <Badge variant="secondary" className="font-normal">
        {mockLabel}
      </Badge>
    )
  }
  return <span className="tabular-nums">{summary}</span>
}
