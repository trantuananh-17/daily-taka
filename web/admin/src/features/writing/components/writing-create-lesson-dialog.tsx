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
import type { CreateWritingLessonInput } from "@/features/writing/lib/writing-cms-mock"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateWritingLessonInput) => void
}

export function WritingCreateLessonDialog({ open, onOpenChange, onSubmit }: Props) {
  const formId = useId()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [contentId, setContentId] = useState("")
  const [sortOrder, setSortOrder] = useState(1)
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    if (!open) {
      setTitle("")
      setSlug("")
      setContentId("")
      setSortOrder(1)
      setIsPublished(false)
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !contentId.trim()) return
    onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      contentId: contentId.trim(),
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
            Map writing_lessons — contentId khớp mock/API learner.
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
              <Label htmlFor={`${formId}-content`}>Content ID</Label>
              <Input
                id={`${formId}-content`}
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
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
