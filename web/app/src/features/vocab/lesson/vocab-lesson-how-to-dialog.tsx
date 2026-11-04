"use client"

import { Dialog as DialogPrimitive } from "@animate-ui/react/primitives/base-ui/dialog"
import { Lightbulb, X } from "lucide-react"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"

const HOW_TO_STEPS = [
  {
    title: "Xem trước 10 từ",
    body: "Đọc nhanh từ, nghĩa và nghe phát âm để làm quen.",
  },
  {
    title: "Học bằng flashcard",
    body: "Chạm để xem nghĩa. Chọn Học lại nếu chưa chắc; từ đó sẽ vào ôn nhanh.",
  },
  {
    title: "Ghép từ với nghĩa",
    body: "Chọn một thẻ ở mỗi cột để tạo cặp. Ghép hết các cặp trước khi vào quiz.",
  },
  {
    title: "Làm quiz",
    body: "Trả lời nhiều dạng câu hỏi và xem phản hồi ngay sau mỗi câu.",
  },
  {
    title: "Ôn đúng từ còn yếu",
    body: "Chỉ những từ sai hoặc đã chọn Học lại mới xuất hiện trong phần ôn nhanh.",
  },
  {
    title: "Hoàn thành bài học",
    body: "Làm xong các bước trên; từ yếu còn lại có thể được mang sang bài tiếp theo.",
  },
] as const

/** Override Animate UI `data-side=bottom` full-bleed so the card floats with margin on mobile. */
const DIALOG_POPUP_CLASS = cn(
  "z-50 flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-[var(--dlx-hairline)] bg-white shadow-xl",
  "!fixed !top-auto !right-4 !bottom-[max(1rem,env(safe-area-inset-bottom))] !left-4 !h-auto !w-auto",
  "!max-h-[calc(100dvh-2rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] !max-w-lg",
  "sm:!left-1/2 sm:!right-auto sm:!w-[min(calc(100%-2rem),32rem)] sm:-translate-x-1/2",
)

type VocabLessonHowToDialogProps = {
  triggerClassName?: string
}

export function VocabLessonHowToDialog({ triggerClassName }: VocabLessonHowToDialogProps) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), triggerClassName)}
        aria-label="Cách học từ vựng"
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
                    Cách học từ vựng
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="m-0 mt-1.5 font-body text-[11px] leading-relaxed text-[var(--dlx-body)] sm:text-[12px]">
                    Lesson sẽ tự hướng dẫn bạn qua từng bước. Hãy hoàn thành hoạt động hiện tại trước khi
                    chuyển tiếp.
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
          <ol className="m-0 min-h-0 flex-1 list-none space-y-2 overflow-y-auto overscroll-contain px-5 py-4">
            {HOW_TO_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-2.5 rounded-xl bg-[color-mix(in_srgb,var(--dlx-primary)_6%,#fff)] px-3 py-2.5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--dlx-primary)_14%,#fff)] font-heading text-[11px] font-semibold text-[var(--dlx-primary)] sm:text-[12px]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="m-0 font-heading text-[11px] font-bold leading-snug text-[var(--dlx-ink)] sm:text-[12px]">
                    {step.title}
                  </p>
                  <p className="m-0 mt-0.5 font-body text-[11px] leading-snug text-[var(--dlx-muted)] sm:text-[12px]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
