"use client"

import { Headphones } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { speakVocabTerm } from "@/lib/learn/vocab/speak-vocab-term"
import type { VocabQuizQuestion, VocabWord } from "@/lib/learn/vocab/types/lesson-story"

type VocabQuizQuestionPanelProps = {
  question: VocabQuizQuestion | undefined
  index: number
  total: number
  selected: number | null
  onSelect: (i: number) => void
  onNext: () => void
  words: VocabWord[]
  heading?: string
  /** When set, replaces `{index + 1}/{total}` in the header (e.g. ôn nhanh cumulative steps). */
  progressDisplay?: { current: number; total: number }
  nextLabel?: string
  doneNextLabel?: string
}

export function VocabQuizQuestionPanel({
  question,
  index,
  total,
  selected,
  onSelect,
  onNext,
  words,
  heading = "QUIZ",
  progressDisplay,
  nextLabel = "Câu tiếp theo",
  doneNextLabel = "Xem kết quả",
}: VocabQuizQuestionPanelProps) {
  if (!question) return null
  const word = words.find((w) => w.id === question.wordId)
  const answered = selected !== null
  const correct = selected === question.correctIndex

  return (
    <>
      <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--dlx-muted)]">
        <span>{heading}</span>
        <span>
          {progressDisplay ? `${progressDisplay.current}/${progressDisplay.total}` : `${index + 1}/${total}`}
        </span>
      </div>
      {question.type === "listenChoice" ? (
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            className="flex size-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--dlx-primary)_15%,#fff)] text-[var(--dlx-primary)]"
            onClick={() => word && speakVocabTerm(word.term)}
          >
            <Headphones className="size-6" strokeWidth={2} aria-hidden />
          </button>
        </div>
      ) : null}
      <p className="text-center font-heading text-lg font-bold text-[var(--dlx-ink)]">{question.prompt}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const letter = String.fromCharCode(65 + optionIndex)
          let variant = "border-border hover:border-[var(--dlx-primary)]"
          if (answered) {
            if (optionIndex === question.correctIndex) variant = "border-green-500 bg-green-50"
            else if (optionIndex === selected) variant = "border-red-400 bg-red-50"
          }
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              className={cn("flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm", variant)}
              onClick={() => onSelect(optionIndex)}
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--dlx-primary)_12%,#fff)] text-xs font-bold text-[var(--dlx-primary)]">
                {letter}
              </span>
              {option}
            </button>
          )
        })}
      </div>
      {answered ? (
        <div className="mt-4 space-y-2">
          <p className={cn("text-center font-semibold", correct ? "text-green-700" : "text-red-700")}>
            {correct ? "Chính xác!" : "Chưa đúng — xem ví dụ bên dưới."}
          </p>
          {question.example ? (
            <div className="rounded-lg bg-[var(--dlx-neutral-1)] p-3 text-left text-sm">
              <p className="m-0 font-semibold text-[var(--dlx-muted)]">Ví dụ</p>
              <p className="m-0 mt-1">{question.example}</p>
              {question.exampleVi ? <p className="m-0 mt-1 text-[var(--dlx-body)]">{question.exampleVi}</p> : null}
            </div>
          ) : null}
          <div className="flex justify-end">
            <Button type="button" className="dlx-btn-primary" onClick={onNext}>
              {index + 1 >= total ? doneNextLabel : nextLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}
