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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CreateSectionInput = {
  sectionNumber: number
  title: string
  sortOrder?: number
  access?: "full" | "preview" | "locked"
}

type ListenCreateSectionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateSectionInput) => void | Promise<void>
}

export function ListenCreateSectionDialog({
  open,
  onOpenChange,
  onSubmit,
}: ListenCreateSectionDialogProps) {
  const formId = useId()
  const [title, setTitle] = useState("")
  const [sectionNumber, setSectionNumber] = useState(1)
  const [sortOrder, setSortOrder] = useState(0)
  const [access, setAccess] = useState<"full" | "preview" | "locked">("full")

  function reset() {
    setTitle("")
    setSectionNumber(1)
    setSortOrder(0)
    setAccess("full")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    void Promise.resolve(
      onSubmit({ title: title.trim(), sectionNumber, sortOrder, access }),
    ).then(() => {
      reset()
      onOpenChange(false)
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm chương (section)</DialogTitle>
          <DialogDescription>
            POST <code className="text-xs">.../categories/:id/sections</code> — cần{" "}
            <strong>sectionNumber</strong>.
          </DialogDescription>
        </DialogHeader>
        <form id={formId} className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor={`${formId}-title`}>Tiêu đề</Label>
            <Input
              id={`${formId}-title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-num`}>sectionNumber</Label>
              <Input
                id={`${formId}-num`}
                type="number"
                min={1}
                value={sectionNumber}
                onChange={(e) => setSectionNumber(Number.parseInt(e.target.value, 10) || 1)}
                required
              />
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
          </div>
          <div className="grid gap-2">
            <Label>access</Label>
            <Select value={access} onValueChange={(v) => v && setAccess(v as typeof access)}>
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
          <Button type="submit" form={formId}>
            Tạo chương
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
