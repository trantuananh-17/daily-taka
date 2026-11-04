import { cn } from "cn"

/** Fixed motion for “Cài đặt bài nghe” — sheet from bottom (Animate UI). */
const POPUP_BASE =
  "z-50 flex max-h-[min(90vh,640px)] w-[min(calc(100%-2rem),28rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl"

export const LISTENING_SETTINGS_DIALOG_MOTION = {
  "data-side": "bottom" as const,
  className: cn(
    "fixed inset-x-4 bottom-4 mx-auto sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2",
    POPUP_BASE,
  ),
}
