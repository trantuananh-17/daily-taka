import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import { formatCount } from "@/lib/admin-dashboard/format"
import type { AdminDashboardLeaderboardEntry } from "@/lib/admin-dashboard/types"

type DashboardLeaderboardPanelProps = {
  rows: AdminDashboardLeaderboardEntry[]
}

export function DashboardLeaderboardPanel({ rows }: DashboardLeaderboardPanelProps) {
  return (
    <DashboardPanel title="Top học viên tích cực · tuần">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-10">
              #
            </TableHead>
            <TableHead scope="col">Học viên</TableHead>
            <TableHead scope="col" className="text-right">
              Điểm
            </TableHead>
            <TableHead scope="col" className="text-right">
              Phút
            </TableHead>
            <TableHead scope="col" className="text-right">
              Streak
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.userId}>
              <TableCell>
                <Badge variant={row.rank <= 3 ? "default" : "secondary"} className="tabular-nums">
                  {row.rank}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{row.displayName}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCount(row.pointsWeek)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCount(row.minutesLearnedWeek)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.streakDays} ngày
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardPanel>
  )
}
