"use client"

import { useEffect, useRef } from "react"
import { Languages } from "lucide-react"
import { cn } from "cn"

import { DictationAudioBar } from "@/features/listen/dictation/dictation-audio-bar"
import { ListenUiSelect } from "@/features/listen/listen-ui-select"
import { useTranscriptLessonAudio } from "@/features/listen/dictation/use-transcript-lesson-audio"
import type { DictationSentence } from "@/lib/learn/listening/types"

type TranscriptPanelProps = {
  audioUrl: string | undefined
  durationMs: number
  sentences: DictationSentence[]
  playbackRate: number
}

export function TranscriptPanel({ audioUrl, durationMs, sentences, playbackRate }: TranscriptPanelProps) {
  const rowRefs = useRef<Map<number, HTMLButtonElement>>(new Map())

  const {
    audioRef,
    playing,
    togglePlay,
    seekToSentence,
    activeIndex,
    progressRatio,
    clockLabel,
    hasAudio,
  } = useTranscriptLessonAudio(audioUrl, sentences, durationMs, playbackRate)

  useEffect(() => {
    if (activeIndex == null) return
    const node = rowRefs.current.get(activeIndex)
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [activeIndex])

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-center justify-end gap-2 border-b border-border pb-3">
        <div className="inline-flex items-center gap-2">
          <Languages className="size-4 text-[var(--dlx-muted)]" strokeWidth={2} aria-hidden />
          <ListenUiSelect
            aria-label="Chế độ dịch"
            value="none"
            onChange={() => undefined}
            options={[{ value: "none", label: "Không dịch" }]}
            triggerClassName="min-w-[7.5rem]"
          />
        </div>
      </div>

      {audioUrl ? <audio ref={audioRef} src={audioUrl} preload="metadata" /> : null}

      <DictationAudioBar
        playing={playing}
        onTogglePlay={togglePlay}
        progressRatio={progressRatio}
        clockLabel={clockLabel}
        disabled={!hasAudio}
      />

      <div className="max-h-[min(32rem,58vh)] space-y-1 overflow-y-auto pr-1">
        {sentences.map((sentence, index) => {
          const isActive = activeIndex != null && index === activeIndex
          return (
            <button
              key={sentence.id ?? sentence.index}
              type="button"
              ref={(node) => {
                if (node) rowRefs.current.set(index, node)
                else rowRefs.current.delete(index)
              }}
              className={cn(
                "flex w-full cursor-pointer items-start gap-3 rounded-md px-2 py-2.5 text-left font-body text-sm transition-colors",
                isActive
                  ? "border-l-4 border-[var(--dlx-primary)] bg-[color-mix(in_srgb,var(--dlx-primary)_14%,#fff)] pl-[calc(0.5rem-3px)]"
                  : "border-l-4 border-transparent hover:bg-[var(--dlx-neutral-1)]",
              )}
              onClick={() => seekToSentence(index, true)}
            >
              <span
                className={cn(
                  "w-6 shrink-0 tabular-nums",
                  isActive ? "font-semibold text-[var(--dlx-primary)]" : "text-[var(--dlx-muted)]",
                )}
              >
                {sentence.index}
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 leading-relaxed",
                  isActive
                    ? "font-medium text-[var(--dlx-primary)] underline decoration-[var(--dlx-primary)] underline-offset-[3px]"
                    : "text-[var(--dlx-body)]",
                )}
              >
                {sentence.transcript}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
