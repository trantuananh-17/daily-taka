"use client"

import { Check, RotateCcw } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { SpeakButton } from "@/features/vocab/lesson/speak-button"
import type { VocabWord } from "@/lib/learn/vocab/types/lesson-story"

type VocabFlashcardPanelProps = {
  word: VocabWord
  index: number
  total: number
  progressDisplay?: { current: number; total: number }
  revealed: boolean
  onReveal: () => void
  onAgain: () => void
  onRemembered: () => void
}

export function VocabFlashcardPanel({
  word,
  index,
  total,
  progressDisplay,
  revealed,
  onReveal,
  onAgain,
  onRemembered,
}: VocabFlashcardPanelProps) {
  const progressLabel = progressDisplay
    ? `${progressDisplay.current}/${progressDisplay.total}`
    : `${index + 1}/${total}`

  return (
    <div className="p-0">
      <div className="mb-3 flex items-center justify-between font-body text-[11px] font-bold tracking-wide text-[var(--dlx-muted)]">
        <span>FLASHCARD</span>
        <span>{progressLabel}</span>
      </div>

      <div
        className={cn(
          "box-border h-80 max-h-80 min-h-80 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,#15803d_18%,var(--dlx-hairline))] sm:h-[17.5rem] sm:max-h-[17.5rem] sm:min-h-[17.5rem]",
          !revealed && "cursor-pointer bg-[color-mix(in_srgb,#15803d_7%,#fff)]",
          revealed && "bg-white shadow-[inset_0_0_0_1px_color-mix(in_srgb,#15803d_10%,transparent)]",
        )}
        onClick={() => {
          if (!revealed) onReveal()
        }}
        onKeyDown={(e) => {
          if (!revealed && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            onReveal()
          }
        }}
        role={revealed ? undefined : "button"}
        tabIndex={revealed ? undefined : 0}
        aria-label={revealed ? undefined : `Xem nghĩa của ${word.term}`}
      >
        {!revealed ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="m-0 font-heading text-[clamp(1.65rem,4vw,2rem)] font-extrabold leading-tight tracking-tight text-[#14532d]">
              {word.term}
            </p>
            <p className="m-0 font-body text-[0.8125rem] text-[color-mix(in_srgb,#14532d_55%,var(--dlx-muted))]">
              {word.ipa} · {word.partOfSpeech}
            </p>
            <p className="m-0 font-body text-[11px] font-semibold text-[var(--dlx-muted)]">Chạm để xem nghĩa</p>
          </div>
        ) : (
          <div className="flex h-full divide-x divide-[var(--dlx-hairline)]">
            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 bg-[#eef2ff] px-3 py-4 text-center sm:px-4">
              <p className="m-0 font-heading text-[clamp(1.5rem,3.5vw,1.85rem)] font-extrabold leading-tight tracking-tight text-[#1e1b4b]">
                {word.term}
              </p>
              <p className="m-0 font-body text-[0.8125rem] text-[color-mix(in_srgb,#1e1b4b_50%,var(--dlx-muted))]">
                {word.ipa} · {word.partOfSpeech}
              </p>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-1.5 overflow-y-auto overscroll-contain bg-[#f0fdf4] px-3 py-4 text-center sm:px-4">
              <p className="m-0 font-heading text-lg font-bold text-[#14532d]">{word.meaningVi}</p>
              <p className="m-0 font-body text-[0.8125rem] leading-snug text-[var(--dlx-body)]">{word.definition}</p>
              <p className="m-0 font-body text-sm italic leading-snug text-[var(--dlx-ink)]">
                &ldquo;{word.example}&rdquo;
              </p>
              {word.exampleVi ? (
                <p className="m-0 font-body text-[0.8125rem] leading-snug text-[var(--dlx-muted)]">{word.exampleVi}</p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <SpeakButton term={word.term} />
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={!revealed}
            className="h-11 border-[color-mix(in_srgb,#dc2626_35%,var(--dlx-hairline))] bg-[color-mix(in_srgb,#dc2626_8%,#fff)] font-body text-sm font-semibold text-[#b91c1c] hover:bg-[color-mix(in_srgb,#dc2626_12%,#fff)] disabled:opacity-45"
            onClick={onAgain}
          >
            <RotateCcw className="size-4 shrink-0" aria-hidden />
            Học lại
          </Button>
          <Button
            type="button"
            disabled={!revealed}
            className="h-11 bg-[#15803d] font-body text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-45"
            onClick={onRemembered}
          >
            <Check className="size-4 shrink-0" aria-hidden />
            Đã nhớ
          </Button>
        </div>
      </div>
    </div>
  )
}
