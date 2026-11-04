"use client"

import { Volume2 } from "lucide-react"
import { cn } from "cn"

import { speakVocabTerm } from "@/lib/learn/vocab/speak-vocab-term"

type SpeakButtonProps = {
  term: string
  className?: string
  /** Empty string = icon only (intro list). */
  label?: string
}

export function SpeakButton({ term, className, label = "Nghe phát âm" }: SpeakButtonProps) {
  const iconOnly = label === ""

  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border font-body font-semibold text-[#15803d] transition-colors",
        "border-[color-mix(in_srgb,#15803d_22%,var(--dlx-hairline))] bg-[#ecfdf3] hover:bg-[#d1fae5]",
        iconOnly ? "size-9 gap-0 p-0" : "gap-2 px-4 py-2 text-sm",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation()
        speakVocabTerm(term)
      }}
      aria-label={iconOnly ? `Nghe phát âm: ${term}` : `${label}: ${term}`}
    >
      <Volume2 className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      {!iconOnly ? <span>{label}</span> : null}
    </button>
  )
}
