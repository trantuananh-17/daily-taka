"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeftIcon } from "lucide-react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import { ListenLessonAudioField } from "@/features/listen/components/listen-lesson-audio-field"
import { ListenLessonSentencesPanel } from "@/features/listen/components/listen-lesson-sentences-panel"
import {
  normalizeListenSentencesForLesson,
  type ListenLessonRow,
  type ListenSentenceRow,
} from "@/features/listen/lib/listen-cms-mock"
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard"

type ListenLessonDetailFormProps = {
  lesson: ListenLessonRow
  sentences: ListenSentenceRow[]
  onLessonChange: (lesson: ListenLessonRow) => void
  onSentencesSave: (sentences: ListenSentenceRow[]) => void
  backHref: string
}

function resolvePlaybackPath(path: string | null): string | null {
  const trimmed = path?.trim()
  if (!trimmed) return null
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed
  }
  return `/${trimmed.replace(/^\//, "")}`
}

export function ListenLessonDetailForm({
  lesson,
  sentences,
  onLessonChange,
  onSentencesSave,
  backHref,
}: ListenLessonDetailFormProps) {
  const grading = lesson.dictationGradingDefaults
  const [sentenceDraft, setSentenceDraft] = useState<ListenSentenceRow[]>(() => structuredClone(sentences))
  const [sentencesDirty, setSentencesDirty] = useState(false)
  const [localAudioPreview, setLocalAudioPreview] = useState<string | null>(null)

  useUnsavedChangesGuard(sentencesDirty)

  useEffect(() => {
    setSentenceDraft(structuredClone(sentences))
    setSentencesDirty(false)
    setLocalAudioPreview(null)
  }, [lesson.id, sentences])

  const audioPlaybackSrc = useMemo(
    () => localAudioPreview ?? resolvePlaybackPath(lesson.audioPublicPath),
    [lesson.audioPublicPath, localAudioPreview],
  )

  function handleSaveSentences() {
    const normalized = normalizeListenSentencesForLesson(lesson.id, sentenceDraft)
    onSentencesSave(normalized)
    setSentenceDraft(structuredClone(normalized))
    setSentencesDirty(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={backHref}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          Quay lại
        </Link>
        <Badge variant="outline">{lesson.sectionTitle}</Badge>
        <Badge variant="secondary">{lesson.levelCode}</Badge>
      </div>

      <DashboardPanel title="Thông tin bài học">
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lesson-title">Tiêu đề</Label>
              <Input
                id="lesson-title"
                value={lesson.title}
                onChange={(e) => onLessonChange({ ...lesson, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lesson-slug">Slug</Label>
              <Input
                id="lesson-slug"
                value={lesson.slug}
                onChange={(e) => onLessonChange({ ...lesson, slug: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="lesson-level">Cấp độ (levelCode)</Label>
              <Input
                id="lesson-level"
                value={lesson.levelCode}
                onChange={(e) => onLessonChange({ ...lesson, levelCode: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lesson-order">Thứ tự (displayOrder)</Label>
              <Input
                id="lesson-order"
                type="number"
                value={lesson.displayOrder}
                onChange={(e) =>
                  onLessonChange({
                    ...lesson,
                    displayOrder: Number.parseInt(e.target.value, 10) || 1,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lesson-stars">Stars (catalog)</Label>
              <Input
                id="lesson-stars"
                type="number"
                min={0}
                max={5}
                value={lesson.stars}
                onChange={(e) =>
                  onLessonChange({ ...lesson, stars: Number.parseInt(e.target.value, 10) || 0 })
                }
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lesson-duration">Thời lượng (durationMs)</Label>
              <Input
                id="lesson-duration"
                type="number"
                min={0}
                value={lesson.durationMs ?? ""}
                onChange={(e) =>
                  onLessonChange({
                    ...lesson,
                    durationMs: e.target.value ? Number.parseInt(e.target.value, 10) : null,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Có thể tự cập nhật khi lưu câu (theo endMs câu cuối).
              </p>
            </div>
          </div>

          <ListenLessonAudioField
            audioPublicPath={lesson.audioPublicPath}
            onAudioPublicPathChange={(audioPublicPath) => onLessonChange({ ...lesson, audioPublicPath })}
            onLocalPreviewUrlChange={setLocalAudioPreview}
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="lesson-grade-case"
                checked={grading.ignoreCase}
                onCheckedChange={(v) =>
                  onLessonChange({
                    ...lesson,
                    dictationGradingDefaults: { ...grading, ignoreCase: v },
                  })
                }
              />
              <Label htmlFor="lesson-grade-case">Bỏ qua hoa thường (ignoreCase)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="lesson-grade-punct"
                checked={grading.ignorePunctuation}
                onCheckedChange={(v) =>
                  onLessonChange({
                    ...lesson,
                    dictationGradingDefaults: { ...grading, ignorePunctuation: v },
                  })
                }
              />
              <Label htmlFor="lesson-grade-punct">Bỏ qua dấu câu (ignorePunctuation)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="lesson-published"
                checked={lesson.isPublished}
                onCheckedChange={(v) => onLessonChange({ ...lesson, isPublished: v })}
              />
              <Label htmlFor="lesson-published">Xuất bản (isPublished)</Label>
            </div>
          </div>
        </div>
      </DashboardPanel>

      <ListenLessonSentencesPanel
        lessonId={lesson.id}
        rows={sentenceDraft}
        audioPlaybackSrc={audioPlaybackSrc}
        saveDisabled={!sentencesDirty}
        onRowsChange={(rows) => {
          setSentenceDraft(rows)
          setSentencesDirty(true)
        }}
        onSave={handleSaveSentences}
      />
    </div>
  )
}
