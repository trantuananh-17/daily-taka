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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CreateListenSectionInput } from "@/features/listen/lib/listen-cms-mock"
import type { TopicRow } from "@/features/topics/lib/topics-mock"

type ListenCreateSectionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  topics: TopicRow[]
  onSubmit: (input: CreateListenSectionInput) => void
}

export function ListenCreateSectionDialog({
  open,
  onOpenChange,
  topics,
  onSubmit,
}: ListenCreateSectionDialogProps) {
  const formId = useId()
  const [topicId, setTopicId] = useState("")
  const [title, setTitle] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [access, setAccess] = useState<"full" | "preview" | "locked">("full")

  useEffect(() => {
    if (!open) {
      setTopicId("")
      setTitle("")
      setSortOrder(0)
      setAccess("full")
      return
    }
    if (topics.length > 0 && !topicId) {
      setTopicId(topics[0]!.id)
    }
  }, [open, topics, topicId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !topicId) return
    onSubmit({ topicId, title: title.trim(), sortOrder, access })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm lesson (chương)</DialogTitle>
          <DialogDescription>
            Chọn topic từ tab Topic · mock createSectionBodySchema
          </DialogDescription>
        </DialogHeader>
        <form id={formId} className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label>Topic</Label>
            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có topic — thêm ở sidebar Topic trước.
              </p>
            ) : (
              <Select
                value={topicId}
                onValueChange={(v) => {
                  if (v) setTopicId(v)
                }}
              >
                <SelectTrigger className="w-full" aria-label="Topic">
                  <SelectValue placeholder="Chọn topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${formId}-title`}>Tiêu đề (title)</Label>
            <Input id={`${formId}-title`} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${formId}-sort`}>sortOrder</Label>
            <Input
              id={`${formId}-sort`}
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number.parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Quyền truy cập (access)</Label>
            <Select value={access} onValueChange={(v) => setAccess(v as typeof access)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">full</SelectItem>
                <SelectItem value="preview">preview</SelectItem>
                <SelectItem value="locked">locked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form={formId} disabled={topics.length === 0}>
            Tạo (mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
