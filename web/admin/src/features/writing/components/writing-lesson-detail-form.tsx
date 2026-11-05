"use client"

import { useEffect, useState } from "react"
import { ArrowLeftIcon } from "lucide-react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import { WritingLessonSentencesPanel } from "@/features/writing/components/writing-lesson-sentences-panel"
import {
  normalizeWritingSentencesForLesson,
  type WritingLessonRow,
  type WritingSentenceRow,
} from "@/features/writing/lib/writing-cms-mock"
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard"

type Props = {
  lesson: WritingLessonRow
  sentences: WritingSentenceRow[]
  onLessonChange: (lesson: WritingLessonRow) => void
  onSentencesSave: (rows: WritingSentenceRow[]) => void
  backHref: string
}

export function WritingLessonDetailForm({
  lesson,
  sentences,
  onLessonChange,
  onSentencesSave,
  backHref,
}: Props) {
  const [sentenceDraft, setSentenceDraft] = useState(() => structuredClone(sentences))
  const [sentencesDirty, setSentencesDirty] = useState(false)

  useUnsavedChangesGuard(sentencesDirty)

  useEffect(() => {
    setSentenceDraft(structuredClone(sentences))
    setSentencesDirty(false)
  }, [lesson.id, sentences])

  function handleSaveSentences() {
    const normalized = normalizeWritingSentencesForLesson(lesson.id, sentenceDraft)
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
        <Badge variant="outline">{lesson.topicTitle}</Badge>
        <Badge variant="secondary">{lesson.levelCode}</Badge>
      </div>

      <DashboardPanel title="Thông tin bài (writing_lessons)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="wr-title">Tiêu đề</Label>
            <Input
              id="wr-title"
              value={lesson.title}
              onChange={(e) => onLessonChange({ ...lesson, title: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wr-slug">Slug</Label>
            <Input
              id="wr-slug"
              value={lesson.slug}
              onChange={(e) => onLessonChange({ ...lesson, slug: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wr-content">Content ID</Label>
            <Input
              id="wr-content"
              value={lesson.contentId}
              onChange={(e) => onLessonChange({ ...lesson, contentId: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wr-order">Thứ tự</Label>
            <Input
              id="wr-order"
              type="number"
              value={lesson.sortOrder}
              onChange={(e) => onLessonChange({ ...lesson, sortOrder: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Xuất bản</p>
            <p className="text-xs text-muted-foreground">is_published</p>
          </div>
          <Switch
            checked={lesson.isPublished}
            onCheckedChange={(checked) => onLessonChange({ ...lesson, isPublished: checked })}
          />
        </div>
      </DashboardPanel>

      <WritingLessonSentencesPanel
        lessonId={lesson.id}
        rows={sentenceDraft}
        onRowsChange={(next) => {
          setSentenceDraft(next)
          setSentencesDirty(true)
        }}
        onSave={handleSaveSentences}
        saveDisabled={!sentencesDirty}
      />
    </div>
  )
}
