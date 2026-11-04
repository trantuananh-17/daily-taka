"use client"

import { useEffect } from "react"

import type { ListeningPlaybackSettings } from "@/lib/learn/listening/listening-playback-settings"

type DictationKeyboardActions = {
  onPlayPause: () => void
  onReplay: () => void
  onCheckNext: () => void
  onSkip: () => void
}

function matchesKey(event: KeyboardEvent, key: ListeningPlaybackSettings["playPauseKey"]): boolean {
  switch (key) {
    case "Space":
      return event.code === "Space"
    case "Ctrl":
      return event.key === "Control"
    case "Enter":
      return event.key === "Enter"
    case "Esc":
      return event.key === "Escape"
    default:
      return false
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "TEXTAREA" || tag === "INPUT" || target.isContentEditable
}

export function useDictationKeyboardShortcuts(
  enabled: boolean,
  settings: ListeningPlaybackSettings,
  actions: DictationKeyboardActions,
) {
  useEffect(() => {
    if (!enabled) return

    function onKeyDown(event: KeyboardEvent) {
      const typing = isTypingTarget(event.target)

      if (matchesKey(event, settings.playPauseKey)) {
        if (typing) return
        event.preventDefault()
        actions.onPlayPause()
        return
      }

      if (matchesKey(event, settings.replayKey)) {
        if (typing) return
        event.preventDefault()
        actions.onReplay()
        return
      }

      if (matchesKey(event, settings.checkNextKey)) {
        if (typing && settings.checkNextKey !== "Enter") return
        if (settings.checkNextKey === "Enter") event.preventDefault()
        actions.onCheckNext()
        return
      }

      if (matchesKey(event, settings.skipKey)) {
        event.preventDefault()
        actions.onSkip()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [enabled, settings, actions])
}
