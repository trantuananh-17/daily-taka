"use client"

import { ArrowRight, BookOpen, Clock3, Layers, Sparkles } from "lucide-react"
import { cn } from "cn"

import { VOCAB_LESSON_JOURNEY_STEPS } from "@/features/vocab/lesson/vocab-lesson-stepper"
import {
  vocabFlowKickerClass,
  vocabFlowPrimaryButtonClass,
  vocabLessonPanelClass,
} from "@/features/vocab/lesson/vocab-lesson-styles"
import { VocabWordStack } from "@/features/vocab/lesson/vocab-word-stack"
import type { VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"

type VocabLessonOverviewProps = {
  story: VocabLessonStory
  totalWords: number
  masteredCount: number
  onStart: () => void
}

export function VocabLessonOverview({
  story,
  totalWords,
  masteredCount,
  onStart,
}: VocabLessonOverviewProps) {
  const progressPct = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0

  return (
    <section className={vocabLessonPanelClass}>
      <div className="grid items-start gap-5 sm:grid-cols-[1fr_minmax(7.5rem,9.5rem)] sm:gap-x-5 sm:gap-y-4">
        <div>
          <span className={vocabFlowKickerClass}>
            <Sparkles className="size-4" strokeWidth={2} aria-hidden />
            Tổng quan bài học
          </span>
          <h1 className="mb-0 mt-2.5 font-heading text-[clamp(1.25rem,3.5vw,1.65rem)] font-extrabold leading-tight tracking-tight text-[var(--dlx-ink)]">
            {story.title}
          </h1>
          <p className="m-0 mt-2 font-body text-[0.8125rem] leading-relaxed text-[var(--dlx-body)]">{story.description}</p>
          <p className="m-0 mt-2 font-body text-[0.8125rem] leading-relaxed text-[var(--dlx-muted)]">
            Học theo từng nhóm nhỏ, luyện nhớ chủ động và chỉ ôn lại những từ còn yếu.
          </p>
        </div>
        <VocabWordStack words={story.words} />
      </div>

      <div className="mt-[1.15rem] grid grid-cols-3 gap-2">
        {[
          { Icon: BookOpen, value: totalWords, label: "từ" },
          { Icon: Layers, value: 1, label: "batch" },
          { Icon: Clock3, value: "~5", label: "phút" },
        ].map(({ Icon, value, label }) => (
          <span
            key={label}
            className="flex flex-col items-center gap-0.5 rounded-xl border border-[var(--dlx-hairline)] bg-[color-mix(in_srgb,var(--dlx-primary)_4%,var(--dlx-neutral-1))] px-1.5 py-2.5 text-[color-mix(in_srgb,var(--dlx-primary)_70%,var(--dlx-muted))]"
          >
            <Icon className="size-6" strokeWidth={2} aria-hidden />
            <b className="font-heading text-[1.15rem] font-extrabold leading-none text-[var(--dlx-ink)]">{value}</b>
            <small className="font-body text-[11px] font-semibold text-[var(--dlx-muted)]">{label}</small>
          </span>
        ))}
      </div>

      <div className="relative mt-[1.1rem] pt-1.5">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[1.35rem] z-0 h-0.5 bg-[var(--dlx-hairline)]"
          aria-hidden
        />
        <ol className="relative z-[1] m-0 flex list-none items-start justify-between gap-1 p-0" aria-label="Tổng quan bài học">
          {VOCAB_LESSON_JOURNEY_STEPS.map((step) => {
            const { Icon } = step
            return (
              <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--dlx-hairline)] bg-white text-[var(--dlx-muted)]">
                  <Icon className="size-5" strokeWidth={2} aria-hidden />
                </span>
                <small className="hidden font-body text-[9px] font-semibold leading-tight text-[var(--dlx-muted)] min-[480px]:block">
                  {step.label}
                </small>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mt-[1.15rem] flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-[var(--dlx-hairline)] pt-4">
        <div className="min-w-0 flex-1 basis-48">
          <span className="mb-1.5 flex items-baseline justify-between gap-2 font-body text-[11px] font-semibold text-[var(--dlx-muted)]">
            Tiến độ toàn bài
            <b className="whitespace-nowrap font-bold text-[var(--dlx-ink)]">
              {masteredCount}/{totalWords} đã thành thạo
            </b>
          </span>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-[var(--dlx-neutral-1)]"
            role="progressbar"
            aria-label="Tiến độ toàn bài"
            aria-valuemin={0}
            aria-valuemax={totalWords}
            aria-valuenow={masteredCount}
          >
            <div
              className="h-full rounded-full bg-[var(--dlx-primary)] transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <button type="button" className={cn(vocabFlowPrimaryButtonClass)} onClick={onStart}>
          Bắt đầu bài học
          <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  )
}
