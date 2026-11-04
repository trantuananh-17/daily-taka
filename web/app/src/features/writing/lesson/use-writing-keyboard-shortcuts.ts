"use client"

import { useEffect } from "react"

type WritingKeyboardActions = {
  /** true while Control is held — hint only, no typing */
  onCtrlHint: (active: boolean) => void
  onNext: () => void
  onSkip: () => void
}

function isInsideDialog(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest('[role="dialog"]'))
}

export function useWritingKeyboardShortcuts(enabled: boolean, actions: WritingKeyboardActions) {
  useEffect(() => {
    if (!enabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (isInsideDialog(event.target)) return

      if (event.key === "Control") {
        event.preventDefault()
        actions.onCtrlHint(true)
        return
      }

      if (event.key === "Enter") {
        event.preventDefault()
        actions.onNext()
        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        actions.onSkip()
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key === "Control") {
        actions.onCtrlHint(false)
      }
    }

    function onBlur() {
      actions.onCtrlHint(false)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
    }
  }, [enabled, actions])
}
