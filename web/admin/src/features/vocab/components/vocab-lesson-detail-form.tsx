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
import { Textarea } from "@/components/ui/textarea"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import { VocabLessonWordsPanel } from "@/features/vocab/components/vocab-lesson-words-panel"
import {
  normalizeVocabWordsForLesson,
  type VocabLessonRow,
  type VocabWordRow,
} from "@/features/vocab/lib/vocab-cms-mock"
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard"

type VocabLessonDetailFormProps = {
  lesson: VocabLessonRow
  words: VocabWordRow[]
  onLessonChange: (lesson: VocabLessonRow) => void
  onWordsSave: (words: VocabWordRow[]) => void
  backHref: string
}

export function VocabLessonDetailForm({
  lesson,
  words,
  onLessonChange,
  onWordsSave,
  backHref,
}: VocabLessonDetailFormProps) {
  const [wordDraft, setWordDraft] = useState<VocabWordRow[]>(() => structuredClone(words))
  const [wordsDirty, setWordsDirty] = useState(false)

  useUnsavedChangesGuard(wordsDirty)

  useEffect(() => {
    setWordDraft(structuredClone(words))
    setWordsDirty(false)
  }, [lesson.id, words])

  function handleSaveWords() {
    const normalized = normalizeVocabWordsForLesson(lesson.id, wordDraft)
    onWordsSave(normalized)
    setWordDraft(structuredClone(normalized))
    setWordsDirty(false)
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

      <DashboardPanel title="Thông tin bài (vocab_lessons)">
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="vocab-lesson-title">Tiêu đề</Label>
              <Input
                id="vocab-lesson-title"
                value={lesson.title}
                onChange={(e) => onLessonChange({ ...lesson, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vocab-lesson-slug">Slug</Label>
              <Input
                id="vocab-lesson-slug"
                value={lesson.slug}
                onChange={(e) => onLessonChange({ ...lesson, slug: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="vocab-story-id">Story ID</Label>
              <Input
                id="vocab-story-id"
                value={lesson.storyId}
                onChange={(e) => onLessonChange({ ...lesson, storyId: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vocab-sort">Thứ tự</Label>
              <Input
                id="vocab-sort"
                type="number"
                value={lesson.sortOrder}
                onChange={(e) =>
                  onLessonChange({ ...lesson, sortOrder: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vocab-desc">Mô tả</Label>
            <Textarea
              id="vocab-desc"
              value={lesson.description}
              onChange={(e) => onLessonChange({ ...lesson, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="vocab-next-id">Next story ID</Label>
              <Input
                id="vocab-next-id"
                value={lesson.nextStoryId ?? ""}
                onChange={(e) =>
                  onLessonChange({
                    ...lesson,
                    nextStoryId: e.target.value.trim() || null,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vocab-next-title">Next story title</Label>
              <Input
                id="vocab-next-title"
                value={lesson.nextStoryTitle ?? ""}
                onChange={(e) =>
                  onLessonChange({
                    ...lesson,
                    nextStoryTitle: e.target.value.trim() || null,
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Xuất bản</p>
              <p className="text-xs text-muted-foreground">is_published</p>
            </div>
            <Switch
              checked={lesson.isPublished}
              onCheckedChange={(checked) => onLessonChange({ ...lesson, isPublished: checked })}
            />
          </div>
        </div>
      </DashboardPanel>

      <VocabLessonWordsPanel
        lessonId={lesson.id}
        rows={wordDraft}
        onRowsChange={(next) => {
          setWordDraft(next)
          setWordsDirty(true)
        }}
        onSave={handleSaveWords}
        saveDisabled={!wordsDirty}
      />
    </div>
  )
}
