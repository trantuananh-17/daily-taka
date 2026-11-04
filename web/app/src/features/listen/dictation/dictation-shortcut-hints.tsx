"use client"

import { RotateCcw } from "lucide-react"

import {
  formatListeningPlaybackKeyLabel,
  type ListeningPlaybackSettings,
} from "@/lib/learn/listening/listening-playback-settings"

type DictationShortcutHintsProps = {
  settings: ListeningPlaybackSettings
  onRestartFromBeginning: () => void
}

export function DictationShortcutHints({ settings, onRestartFromBeginning }: DictationShortcutHintsProps) {
  if (!settings.showShortcutTips) return null

  return (
    <div className="mb-4 flex max-md:hidden flex-wrap items-center gap-x-3 gap-y-2 font-body text-[11px] text-[var(--dlx-muted)]">
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded border border-border bg-white px-1.5 py-0.5">
          {formatListeningPlaybackKeyLabel(settings.playPauseKey)}
        </kbd>
        Phát / tạm dừng
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded border border-border bg-white px-1.5 py-0.5">
          {formatListeningPlaybackKeyLabel(settings.replayKey)}
        </kbd>
        Nghe lại
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded border border-border bg-white px-1.5 py-0.5">
          {formatListeningPlaybackKeyLabel(settings.checkNextKey)}
        </kbd>
        Kiểm tra / Tiếp
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded border border-border bg-white px-1.5 py-0.5">
          {formatListeningPlaybackKeyLabel(settings.skipKey)}
        </kbd>
        Bỏ qua
      </span>
      {settings.showRestartFromBeginning ? (
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-inherit text-[11px] text-[var(--dlx-muted)] hover:text-[var(--dlx-ink)]"
          onClick={onRestartFromBeginning}
        >
          <span className="inline-flex size-[1.35rem] items-center justify-center rounded border border-border bg-white">
            <RotateCcw className="size-3" strokeWidth={2} aria-hidden />
          </span>
          Học lại từ đầu
        </button>
      ) : null}
    </div>
  )
}
