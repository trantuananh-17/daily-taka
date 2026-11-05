"use client"

import { useCallback, useRef } from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  createListenSentenceRow,
  type ListenSentenceRow,
} from "@/features/listen/lib/listen-cms-mock"

type ListenLessonSentencesPanelProps = {
  lessonId: string
  rows: ListenSentenceRow[]
  onRowsChange: (rows: ListenSentenceRow[]) => void
  onSave: () => void
  audioPlaybackSrc: string | null
  saveDisabled?: boolean
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${String(rem).padStart(2, "0")}`
}

export function ListenLessonSentencesPanel({
  lessonId,
  rows,
  onRowsChange,
  onSave,
  audioPlaybackSrc,
  saveDisabled,
}: ListenLessonSentencesPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSegment = useCallback(
    async (startMs: number, endMs: number) => {
      const audio = audioRef.current
      if (!audio || !audioPlaybackSrc) return
      if (audio.src !== audioPlaybackSrc) {
        audio.src = audioPlaybackSrc
      }
      audio.currentTime = startMs / 1000
      try {
        await audio.play()
      } catch {
        /* autoplay policy */
      }
      const stopAt = endMs > startMs ? endMs : startMs + 5000
      const onTime = () => {
        if (audio.currentTime * 1000 >= stopAt) {
          audio.pause()
          audio.removeEventListener("timeupdate", onTime)
        }
      }
      audio.addEventListener("timeupdate", onTime)
    },
    [audioPlaybackSrc],
  )

  function updateRow(id: string, patch: Partial<ListenSentenceRow>) {
    onRowsChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function removeRow(id: string) {
    onRowsChange(rows.filter((r) => r.id !== id))
  }

  function addRow() {
    const nextPosition = rows.length > 0 ? Math.max(...rows.map((r) => r.position)) + 1 : 1
    const last = rows.at(-1)
    const row = createListenSentenceRow(lessonId, nextPosition)
    if (last && last.endMs > 0) {
      row.startMs = last.endMs
      row.endMs = last.endMs
    }
    onRowsChange([...rows, row])
  }

  return (
    <DashboardPanel
      title="Câu & transcript"
      action={
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm câu
          </Button>
          <Button type="button" size="sm" onClick={onSave} disabled={saveDisabled}>
            Lưu câu (mock)
          </Button>
        </div>
      }
    >
      <p className="mb-4 text-xs text-muted-foreground">
        Khớp <code className="text-[11px]">upsertSentencesBodySchema</code> — transcript là đáp án dictation và
        nội dung tab Transcript trên learner.
      </p>
      {audioPlaybackSrc ? (
        <audio ref={audioRef} className="sr-only" preload="metadata" src={audioPlaybackSrc} />
      ) : null}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-28">Bắt đầu (ms)</TableHead>
              <TableHead className="w-28">Kết thúc (ms)</TableHead>
              <TableHead className="w-24">Preview</TableHead>
              <TableHead>Transcript</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Chưa có câu — bấm Thêm câu.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="tabular-nums">{index + 1}</TableCell>
                  <TableCell>
                    <Label className="sr-only" htmlFor={`start-${row.id}`}>
                      Bắt đầu ms
                    </Label>
                    <Input
                      id={`start-${row.id}`}
                      type="number"
                      min={0}
                      className="h-8 tabular-nums"
                      value={row.startMs}
                      onChange={(e) =>
                        updateRow(row.id, {
                          startMs: Number.parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Label className="sr-only" htmlFor={`end-${row.id}`}>
                      Kết thúc ms
                    </Label>
                    <Input
                      id={`end-${row.id}`}
                      type="number"
                      min={0}
                      className="h-8 tabular-nums"
                      value={row.endMs}
                      onChange={(e) =>
                        updateRow(row.id, {
                          endMs: Number.parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <span className="block text-xs tabular-nums text-muted-foreground">
                      {formatMs(row.startMs)} – {formatMs(row.endMs)}
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs"
                      disabled={!audioPlaybackSrc}
                      onClick={() => playSegment(row.startMs, row.endMs)}
                    >
                      Nghe đoạn
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      className="min-h-[4rem] text-sm"
                      value={row.transcript}
                      placeholder="Nội dung câu (transcript)…"
                      onChange={(e) => updateRow(row.id, { transcript: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Xóa câu"
                      onClick={() => removeRow(row.id)}
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
