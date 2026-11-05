"use client"

import { useCallback, useEffect, useRef } from "react"

const DEFAULT_MESSAGE =
  "Bạn có thay đổi chưa lưu. Rời trang mà không lưu?"

export function useUnsavedChangesGuard(when: boolean, message = DEFAULT_MESSAGE) {
  const whenRef = useRef(when)
  whenRef.current = when

  const confirmLeave = useCallback((): boolean => {
    if (!whenRef.current) return true
    return window.confirm(message)
  }, [message])

  useEffect(() => {
    if (!when) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [when])

  useEffect(() => {
    if (!when) return

    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest("a")
      if (!anchor || anchor.hasAttribute("download")) return

      const target = anchor.getAttribute("target")
      if (target && target !== "_self") return

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return
      }

      if (!confirmLeave()) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener("click", onClickCapture, true)
    return () => document.removeEventListener("click", onClickCapture, true)
  }, [when, confirmLeave])

  return { confirmLeave, isBlocking: when }
}
