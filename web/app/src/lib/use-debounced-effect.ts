"use client"

import { useEffect, useRef } from "react"

/** Runs `effect` after `delayMs` quiet period; cleans up pending timer on change/unmount. */
export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: readonly unknown[],
  delayMs: number,
) {
  const effectRef = useRef(effect)
  effectRef.current = effect

  useEffect(() => {
    const timer = window.setTimeout(() => {
      effectRef.current()
    }, delayMs)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns deps list
  }, [...deps, delayMs])
}
