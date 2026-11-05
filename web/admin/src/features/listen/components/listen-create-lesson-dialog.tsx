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
import type { CreateListenLessonInput } from "@/features/listen/lib/listen-cms-mock"

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const

type ListenCreateLessonDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateListenLessonInput) => void
}

export function ListenCreateLessonDialog({
  open,
  onOpenChange,
  onSubmit,
}: ListenCreateLessonDialogProps) {
  const formId = useId()
  const [form, setForm] = useState<CreateListenLessonInput>({
    slug: "",
    title: "",
    levelCode: "A2",
    displayOrder: 1,
    stars: 0,
    templateType: "audio",
    isPublished: false,
    dictationGradingDefaults: { ignoreCase: true, ignorePunctuation: false },
  })

  useEffect(() => {
    if (!open) {
      setForm({
        slug: "",
        title: "",
        levelCode: "A2",
        displayOrder: 1,
        stars: 0,
        templateType: "audio",
        isPublished: false,
        dictationGradingDefaults: { ignoreCase: true, ignorePunctuation: false },
      })
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.slug.trim() || !form.title.trim()) return
    onSubmit({
      ...form,
      slug: form.slug.trim(),
      title: form.title.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm bài học</DialogTitle>
          <DialogDescription>
            Tạo metadata cơ bản. Gắn audio và câu/transcript ở màn chi tiết sau khi tạo.
          </DialogDescription>
        </DialogHeader>
        <form id={formId} className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-title`}>Tiêu đề (title)</Label>
              <Input
                id={`${formId}-title`}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-slug`}>Slug</Label>
              <Input
                id={`${formId}-slug`}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-level`}>Level (levelCode)</Label>
              <Input
                id={`${formId}-level`}
                list={`${formId}-levels`}
                value={form.levelCode}
                onChange={(e) => setForm((f) => ({ ...f, levelCode: e.target.value }))}
              />
              <datalist id={`${formId}-levels`}>
                {LEVELS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-order`}>Thứ tự (displayOrder)</Label>
              <Input
                id={`${formId}-order`}
                type="number"
                min={1}
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, displayOrder: Number.parseInt(e.target.value, 10) || 1 }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-stars`}>Stars (catalog)</Label>
              <Input
                id={`${formId}-stars`}
                type="number"
                min={0}
                max={5}
                value={form.stars ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stars: Number.parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
          </div>
          <fieldset className="grid gap-2 rounded-lg border p-3">
            <legend className="px-1 text-sm font-medium">dictationGradingDefaults</legend>
            <div className="flex items-center justify-between">
              <Label htmlFor={`${formId}-ignore-case`}>ignoreCase</Label>
              <Switch
                id={`${formId}-ignore-case`}
                checked={form.dictationGradingDefaults?.ignoreCase ?? true}
                onCheckedChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    dictationGradingDefaults: {
                      ignoreCase: v,
                      ignorePunctuation: f.dictationGradingDefaults?.ignorePunctuation ?? false,
                    },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor={`${formId}-ignore-punct`}>ignorePunctuation</Label>
              <Switch
                id={`${formId}-ignore-punct`}
                checked={form.dictationGradingDefaults?.ignorePunctuation ?? false}
                onCheckedChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    dictationGradingDefaults: {
                      ignoreCase: f.dictationGradingDefaults?.ignoreCase ?? true,
                      ignorePunctuation: v,
                    },
                  }))
                }
              />
            </div>
          </fieldset>
          <div className="flex items-center justify-between">
            <Label htmlFor={`${formId}-pub`}>isPublished</Label>
            <Switch
              id={`${formId}-pub`}
              checked={form.isPublished ?? false}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form={formId}>
            Tạo (mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
