"use client"

import { useId, useState } from "react"

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
type CreateCategoryInput = {
  slug: string
  name: string
  isPublished?: boolean
}

type ListenCreateTopicDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateCategoryInput) => void | Promise<void>
}

const emptyForm = (): CreateCategoryInput => ({
  slug: "",
  name: "",
  isPublished: true,
})

export function ListenCreateTopicDialog({
  open,
  onOpenChange,
  onSubmit,
}: ListenCreateTopicDialogProps) {
  const formId = useId()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Nhập tên và slug.")
      return
    }
    void Promise.resolve(
      onSubmit({
        slug: form.slug.trim(),
        name: form.name.trim(),
        isPublished: form.isPublished ?? true,
      }),
    ).then(() => {
      setForm(emptyForm())
      setError(null)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm chủ đề</DialogTitle>
          <DialogDescription>
            POST listening category — <code className="text-xs">name</code>,{" "}
            <code className="text-xs">slug</code>
          </DialogDescription>
        </DialogHeader>
        <form id={formId} className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor={`${formId}-name`}>Tên</Label>
            <Input
              id={`${formId}-name`}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Short stories"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${formId}-slug`}>Slug</Label>
            <Input
              id={`${formId}-slug`}
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="short-stories"
              required
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor={`${formId}-published`}>Trạng thái (publish)</Label>
            <Switch
              id={`${formId}-published`}
              checked={form.isPublished ?? true}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form={formId}>
            Tạo chủ đề
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
