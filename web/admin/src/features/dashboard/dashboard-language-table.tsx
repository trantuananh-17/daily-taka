import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import { DbContentCell } from "@/features/dashboard/components/db-content-cell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatListenPublishedDraft,
  formatVocabSummary,
  formatWritingSummary,
} from "@/lib/admin-dashboard/selectors"
import type { LanguageDashboardSlice } from "@/lib/admin-dashboard/types"

type DashboardLanguageTableProps = {
  rows: LanguageDashboardSlice[]
}

export function DashboardLanguageTable({ rows }: DashboardLanguageTableProps) {
  return (
    <DashboardPanel title="Nội dung theo ngôn ngữ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Ngôn ngữ</TableHead>
            <TableHead scope="col">Listen (published / draft)</TableHead>
            <TableHead scope="col">Vocab</TableHead>
            <TableHead scope="col">Writing</TableHead>
            <TableHead scope="col" className="text-right">
              Thiếu audio
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.language}>
              <TableCell className="font-medium">
                <span className="mr-2 uppercase tabular-nums text-muted-foreground">
                  {row.language}
                </span>
                {row.label}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatListenPublishedDraft(row)}
                <span className="ml-1 text-muted-foreground">· {row.listen.categories} cat</span>
              </TableCell>
              <TableCell>
                <DbContentCell summary={formatVocabSummary(row)} />
              </TableCell>
              <TableCell>
                <DbContentCell summary={formatWritingSummary(row)} />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.listen.lessonsMissingAudio}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardPanel>
  )
}
