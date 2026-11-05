"use client"

import { PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import {
  createWritingSentenceRow,
  type WritingSentenceRow,
} from "@/features/writing/lib/writing-cms-mock"

type Props = {
  lessonId: string
  rows: WritingSentenceRow[]
  onRowsChange: (rows: WritingSentenceRow[]) => void
  onSave: () => void
  saveDisabled?: boolean
}

export function WritingLessonSentencesPanel({
  lessonId,
  rows,
  onRowsChange,
  onSave,
  saveDisabled,
}: Props) {
  function updateRow(id: string, patch: Partial<WritingSentenceRow>) {
    onRowsChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function removeRow(id: string) {
    onRowsChange(rows.filter((r) => r.id !== id))
  }

  function addRow() {
    onRowsChange([...rows, createWritingSentenceRow(lessonId, rows.length + 1)])
  }

  return (
    <DashboardPanel
      title="Câu luyện viết (writing_sentences)"
      description="PUT /sentences — promptVi, targetDefault, pronunciation (mock)."
      action={
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm câu
          </Button>
          <Button type="button" size="sm" onClick={onSave} disabled={saveDisabled}>
            Lưu câu
          </Button>
        </div>
      }
    >
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead>Gợi ý (VI)</TableHead>
              <TableHead>Đáp án</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Chưa có câu.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="tabular-nums text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <Textarea
                      value={row.promptVi}
                      onChange={(e) => updateRow(row.id, { promptVi: e.target.value })}
                      rows={2}
                      className="min-h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.targetDefault}
                      onChange={(e) => updateRow(row.id, { targetDefault: e.target.value })}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeRow(row.id)}
                      aria-label="Xóa câu"
                    >
                      <Trash2Icon className="size-4" aria-hidden />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardPanel>
  )
}
