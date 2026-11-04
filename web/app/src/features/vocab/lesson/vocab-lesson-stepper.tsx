"use client"

import { BookOpen, Check, Layers, Link2, RefreshCw, Sparkles } from "lucide-react"
import { cn } from "cn"

import { vocabLessonPanelClass } from "@/features/vocab/lesson/vocab-lesson-styles"
import type { VocabLessonStep } from "@/lib/learn/vocab/types/lesson-story"

export const VOCAB_LESSON_JOURNEY_STEPS: {
  id: Exclude<VocabLessonStep, "overview" | "lessonComplete">
  label: string
  Icon: typeof BookOpen
}[] = [
  { id: "intro", label: "Làm quen với từ mới", Icon: BookOpen },
  { id: "flashcard", label: "Flashcard", Icon: Layers },
  { id: "matching", label: "Ghép thẻ", Icon: Link2 },
  { id: "quiz", label: "Quiz", Icon: Sparkles },
  { id: "review", label: "Ôn nhanh", Icon: RefreshCw },
]

const STEPS = VOCAB_LESSON_JOURNEY_STEPS

type VocabLessonStepperProps = {
  activeStep: VocabLessonStep
  stepLabel: string
  masteredCount: number
  totalWords: number
  activityProgress: number
  activityTotal: number
}

function stepIndex(step: VocabLessonStep): number {
  if (step === "overview" || step === "lessonComplete") return -1
  return STEPS.findIndex((row) => row.id === step)
}

export function VocabLessonStepper({
  activeStep,
  stepLabel,
  masteredCount,
  totalWords,
  activityProgress,
  activityTotal,
}: VocabLessonStepperProps) {
  const activeIdx = stepIndex(activeStep)
  const overallPct = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0
  const activityPct = activityTotal > 0 ? Math.round((activityProgress / activityTotal) * 100) : 0

  return (
    <div className={vocabLessonPanelClass}>
      <div className="mb-4 flex items-center justify-between gap-2 text-xs font-semibold text-[var(--dlx-muted)]">
        <span>Batch 1 / 1</span>
        <span className="text-[var(--dlx-ink)]">{stepLabel}</span>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[1.125rem] z-0 h-0.5 bg-[var(--dlx-hairline)]"
          aria-hidden
        />
        <ol className="relative z-[1] m-0 flex list-none items-start justify-between gap-0 p-0">
          {STEPS.map((step, index) => {
            const done = activeIdx > index
            const active = activeIdx === index
            const { Icon } = step
            return (
              <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg border-2 transition-colors",
                    done &&
                      "border-[var(--dlx-primary)] bg-[color-mix(in_srgb,var(--dlx-primary)_15%,#fff)] text-[var(--dlx-primary)]",
                    active &&
                      "border-[var(--dlx-primary)] bg-[var(--dlx-primary)] text-white shadow-[0_0_0_4px_color-mix(in_srgb,var(--dlx-primary)_18%,transparent)]",
                    !done && !active && "border-[var(--dlx-hairline)] bg-white text-[var(--dlx-muted)]",
                  )}
                >
                  {done ? (
                    <Check className="size-4" strokeWidth={2} aria-hidden />
                  ) : (
                    <Icon className="size-4" strokeWidth={2} aria-hidden />
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-center text-[10px] font-medium leading-tight sm:block",
                    active ? "font-bold text-[var(--dlx-primary)]" : "text-[var(--dlx-muted)]",
                  )}
                >
                  {step.label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-[11px] font-semibold text-[var(--dlx-muted)]">
            <span>Tiến độ toàn bài</span>
            <span>
              {masteredCount}/{totalWords} đã thành thạo
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--dlx-neutral-1)]">
            <div className="h-full bg-[var(--dlx-primary)] transition-[width] duration-300" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11px] font-semibold text-[var(--dlx-muted)]">
            <span>Hoạt động hiện tại</span>
            <span>
              {activityProgress}/{activityTotal}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--dlx-neutral-1)]">
            <div className="h-full bg-[var(--dlx-primary)] transition-[width] duration-300" style={{ width: `${activityPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
