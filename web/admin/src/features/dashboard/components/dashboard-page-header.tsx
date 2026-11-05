import { Badge } from "@/components/ui/badge"
import { formatDashboardTimestamp } from "@/lib/admin-dashboard/format"

type DashboardPageHeaderProps = {
  generatedAt: string
}

export function DashboardPageHeader({ generatedAt }: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-heading text-xl font-bold tracking-tight">Dashboard</h2>
      <Badge variant="outline" className="shrink-0 tabular-nums">
        Cập nhật · {formatDashboardTimestamp(generatedAt)}
      </Badge>
    </div>
  )
}
