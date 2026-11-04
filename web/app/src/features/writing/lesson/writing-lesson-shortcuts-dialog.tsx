"use client"

import { Dialog as DialogPrimitive } from "@animate-ui/react/primitives/base-ui/dialog"
import { Lightbulb, X } from "lucide-react"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"

/** Same floating bottom sheet as vocab how-to. */
const DIALOG_POPUP_CLASS = cn(
  "z-50 flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-[var(--dlx-hairline)] bg-white shadow-xl",
  "!fixed !top-auto !right-4 !bottom-[max(1rem,env(safe-area-inset-bottom))] !left-4 !h-auto !w-auto",
  "!max-h-[calc(100dvh-2rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] !max-w-lg",
  "sm:!left-1/2 sm:!right-auto sm:!w-[min(calc(100%-2rem),32rem)] sm:-translate-x-1/2",
)

const WRITING_SHORTCUTS = [
  {
    key: "Ctrl",
    body: "Giữ phím để gợi ý từ đang gõ hoặc từ kế tiếp — thả ra thì gợi ý biến mất (không tự điền)",
  },
  {
    key: "Enter",
    body: "Sang câu tiếp theo",
  },
  {
    key: "Esc",
    body: "Bỏ qua câu hiện tại",
  },
] as const

type WritingLessonShortcutsDialogProps = {
  triggerClassName?: string
}

export function WritingLessonShortcutsDialog({ triggerClassName }: WritingLessonShortcutsDialogProps) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), triggerClassName)}
        aria-label="Hướng dẫn phím tắt luyện viết"
      >
        <Lightbulb className="size-[19px] text-[#c9a227]" strokeWidth={2} aria-hidden />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[color-mix(in_srgb,#1e293b_45%,transparent)] supports-backdrop-filter:backdrop-blur-[2px]" />
        <DialogPrimitive.Popup data-side="bottom" className={DIALOG_POPUP_CLASS}>
          <div className="shrink-0 border-b border-[var(--dlx-hairline)] px-5 pb-3.5 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,#f5e6a8_55%,#fff)] text-[#c9a227]">
                  <Lightbulb className="size-5" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <DialogPrimitive.Title className="m-0 font-heading text-[11px] font-bold text-[var(--dlx-ink)] sm:text-[12px]">
                    Hướng dẫn phím tắt
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="m-0 mt-1.5 font-body text-[11px] leading-relaxed text-[var(--dlx-body)] sm:text-[12px]">
                    Dùng các phím tắt này để luyện viết nhanh và liền mạch hơn.
                  </DialogPrimitive.Description>
                </div>
              </div>
              <DialogPrimitive.Close
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9 shrink-0 rounded-full border-[var(--dlx-hairline)] bg-[color-mix(in_srgb,var(--dlx-primary)_4%,#fff)]"
                  />
                }
                aria-label="Đóng"
              >
                <X className="size-4 text-[var(--dlx-muted)]" strokeWidth={2} aria-hidden />
              </DialogPrimitive.Close>
            </div>
          </div>
          <ul className="m-0 min-h-0 flex-1 list-none space-y-2 overflow-y-auto overscroll-contain px-5 py-4">
            {WRITING_SHORTCUTS.map((row) => (
              <li
                key={row.key}
                className="flex items-center gap-3 rounded-xl bg-[color-mix(in_srgb,var(--dlx-primary)_6%,#fff)] px-3 py-2.5"
              >
                <kbd className="inline-flex min-w-[3.25rem] shrink-0 items-center justify-center rounded-lg border border-[var(--dlx-hairline)] bg-white px-2 py-1 font-mono text-[11px] font-semibold text-[var(--dlx-ink)] shadow-sm sm:text-[12px]">
                  {row.key}
                </kbd>
                <p className="m-0 font-body text-[11px] leading-snug text-[var(--dlx-body)] sm:text-[12px]">{row.body}</p>
              </li>
            ))}
          </ul>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
