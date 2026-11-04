"use client"

import { Pause, Play } from "lucide-react"

type DictationAudioBarProps = {
  playing: boolean
  onTogglePlay: () => void
  progressRatio: number
  clockLabel: string
  disabled?: boolean
}

export function DictationAudioBar({
  playing,
  onTogglePlay,
  progressRatio,
  clockLabel,
  disabled = false,
}: DictationAudioBarProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <button
        type="button"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--dlx-primary)] text-white disabled:opacity-50"
        onClick={onTogglePlay}
        aria-label={playing ? "Tạm dừng" : "Phát"}
        disabled={disabled}
      >
        {playing ? (
          <Pause className="size-5" strokeWidth={2} fill="currentColor" />
        ) : (
          <Play className="size-5" strokeWidth={2} fill="currentColor" />
        )}
      </button>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--dlx-neutral-1)]">
        <div
          className="h-full rounded-full bg-[var(--dlx-primary)]"
          style={{ width: `${Math.min(100, Math.max(0, progressRatio * 100))}%` }}
        />
      </div>
      <span className="font-body text-xs tabular-nums text-[var(--dlx-muted)]">{clockLabel}</span>
    </div>
  )
}
