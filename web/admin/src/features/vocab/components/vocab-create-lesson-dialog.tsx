"use client"

import { useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { CreateVocabLessonInput } from "@/features/vocab/lib/vocab-cms-mock"

type VocabCreateLessonDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateVocabLessonInput) => void
}

export function VocabCreateLessonDialog({
  open,
  onOpenChange,
  onSubmit,
}: VocabCreateLessonDialogProps) {
  const formId = useId()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [storyId, setStoryId] = useState("")
  const [sortOrder, setSortOrder] = useState(1)
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    if (!open) {
      setTitle("")
      setSlug("")
      setStoryId("")
      setSortOrder(1)
      setIsPublished(false)
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !storyId.trim()) return
    onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      storyId: storyId.trim(),
      sortOrder,
      isPublished,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm bài học</DialogTitle>
          <DialogDescription>
            Map <code className="text-xs">vocab_lessons</code> — cần <strong>storyId</strong> khớp
            learner.
          </DialogDescription>
        </DialogHeader>
        <form id={formId} className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor={`${formId}-title`}>Tiêu đề</Label>
            <Input id={`${formId}-title`} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-slug`}>Slug</Label>
              <Input id={`${formId}-slug`} value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-story`}>Story ID</Label>
              <Input
                id={`${formId}-story`}
                value={storyId}
                onChange={(e) => setStoryId(e.target.value)}
                placeholder="lesson-01"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${formId}-order`}>Thứ tự</Label>
            <Input
              id={`${formId}-order`}
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor={`${formId}-pub`}>Xuất bản</Label>
            <Switch id={`${formId}-pub`} checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
          <DialogFooter>
            <Button type="submit">Tạo bài</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
