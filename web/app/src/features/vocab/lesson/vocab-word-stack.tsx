"use client"

import { BookOpen, Sparkles } from "lucide-react"
import { cn } from "cn"

import type { VocabWord } from "@/lib/learn/vocab/types/lesson-story"

type VocabWordStackProps = {
  words: VocabWord[]
}

const cardBase =
  "absolute left-1/2 flex w-[7.5rem] origin-bottom flex-col items-start gap-0.5 rounded-[14px] border border-[color-mix(in_srgb,var(--dlx-primary)_12%,var(--dlx-hairline))] bg-gradient-to-br from-[color-mix(in_srgb,var(--dlx-primary)_6%,#fff)] to-white px-3 py-2.5 shadow-[0_10px_24px_color-mix(in_srgb,var(--dlx-ink)_8%,transparent)]"

export function VocabWordStack({ words }: VocabWordStackProps) {
  const front = words[0]
  if (!front) return null

  const mid = words[1]
  const back = words[2]

  return (
    <div className="relative mx-auto h-[7.75rem] w-full max-w-[9.5rem] sm:mx-0 sm:justify-self-end" aria-hidden>
      <span className="absolute -right-0.5 -top-1 z-[4] flex size-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,#f5e6a8_55%,#fff)] text-[#c9a227] shadow-[0_4px_14px_color-mix(in_srgb,#c9a227_25%,transparent)]">
        <Sparkles width={24} height={24} strokeWidth={2} aria-hidden />
      </span>
      {back ? <StackCard word={back} layer="back" /> : null}
      {mid ? <StackCard word={mid} layer="mid" /> : null}
      <StackCard word={front} layer="front" />
    </div>
  )
}

function StackCard({ word, layer }: { word: VocabWord; layer: "front" | "mid" | "back" }) {
  return (
    <div
      className={cn(
        cardBase,
        layer === "back" && "bottom-0 z-[1] -translate-x-[calc(50%+6px)] scale-[0.94] -rotate-[7deg] opacity-55",
        layer === "mid" && "bottom-[0.35rem] z-[2] -translate-x-[calc(50%-4px)] scale-[0.97] rotate-[4deg] opacity-[0.78]",
        layer === "front" &&
          "bottom-[0.65rem] z-[3] -translate-x-1/2 scale-100 shadow-[0_12px_28px_color-mix(in_srgb,var(--dlx-ink)_10%,transparent),0_0_0_1px_color-mix(in_srgb,var(--dlx-primary)_8%,transparent)]",
      )}
    >
      <span className="inline-flex items-center gap-1 font-body text-[10px] font-semibold text-[var(--dlx-muted)]">
        <BookOpen width={15} height={15} strokeWidth={2} aria-hidden />
        từ
      </span>
      <strong className="font-heading text-[1.05rem] font-extrabold leading-tight text-[var(--dlx-ink)]">{word.term}</strong>
      <small className="font-body text-[11px] leading-snug text-[var(--dlx-muted)]">{word.meaningVi}</small>
    </div>
  )
}
