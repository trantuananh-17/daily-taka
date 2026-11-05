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
  createVocabWordRow,
  type VocabWordRow,
} from "@/features/vocab/lib/vocab-cms-mock"

type VocabLessonWordsPanelProps = {
  lessonId: string
  rows: VocabWordRow[]
  onRowsChange: (rows: VocabWordRow[]) => void
  onSave: () => void
  saveDisabled?: boolean
}

export function VocabLessonWordsPanel({
  lessonId,
  rows,
  onRowsChange,
  onSave,
  saveDisabled,
}: VocabLessonWordsPanelProps) {
  function updateRow(id: string, patch: Partial<VocabWordRow>) {
    onRowsChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function removeRow(id: string) {
    onRowsChange(rows.filter((r) => r.id !== id))
  }

  function addRow() {
    onRowsChange([...rows, createVocabWordRow(lessonId, rows.length + 1)])
  }

  return (
    <DashboardPanel
      title="Từ vựng (vocab_words)"
      description="Mỗi dòng = một row bảng vocab_words. Lưu mock → PUT /words sau."
      action={
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm từ
          </Button>
          <Button type="button" size="sm" onClick={onSave} disabled={saveDisabled}>
            Lưu từ
          </Button>
        </div>
      }
    >
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">Slug</TableHead>
              <TableHead className="w-[100px]">Từ</TableHead>
              <TableHead className="w-[80px]">Loại</TableHead>
              <TableHead>Nghĩa VI</TableHead>
              <TableHead>Definition</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Chưa có từ — bấm Thêm từ.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      value={row.slug}
                      onChange={(e) => updateRow(row.id, { slug: e.target.value })}
                      className="h-8 font-mono text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.term}
                      onChange={(e) => updateRow(row.id, { term: e.target.value })}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.partOfSpeech}
                      onChange={(e) => updateRow(row.id, { partOfSpeech: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.meaningVi}
                      onChange={(e) => updateRow(row.id, { meaningVi: e.target.value })}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={row.definition}
                      onChange={(e) => updateRow(row.id, { definition: e.target.value })}
                      rows={2}
                      className="min-h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeRow(row.id)}
                      aria-label="Xóa từ"
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
