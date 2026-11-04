"use client"

import { useCallback, useEffect, useRef } from "react"

const TILT = 8
const POINTER_SMOOTH = 0.2
const RESET_SMOOTH = 0.14
const SETTLE_EPS = 0.04

type MotionState = {
  rotateX: number
  rotateY: number
  pointerX: number
  pointerY: number
}

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount
}

function createIdleMotion(defaultPointerY: number): MotionState {
  return {
    rotateX: 0,
    rotateY: 0,
    pointerX: 0.5,
    pointerY: defaultPointerY,
  }
}

type PointerCardMotionOptions = {
  /** Base class on the element, e.g. `language-card` */
  cardClass: string
  defaultPointerY?: number
}

export function usePointerCardMotion({
  cardClass,
  defaultPointerY = 0.38,
}: PointerCardMotionOptions) {
  const ref = useRef<HTMLAnchorElement>(null)
  const rafRef = useRef<number | null>(null)
  const trackingRef = useRef(false)
  const resettingRef = useRef(false)
  const targetRef = useRef<MotionState>(createIdleMotion(defaultPointerY))
  const currentRef = useRef<MotionState>(createIdleMotion(defaultPointerY))

  const trackingClass = `${cardClass}--tracking`

  const applyMotion = useCallback((state: MotionState) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--home-rotate-x", `${state.rotateX.toFixed(3)}deg`)
    el.style.setProperty("--home-rotate-y", `${state.rotateY.toFixed(3)}deg`)
    el.style.setProperty("--home-glow-x", String(state.pointerX))
    el.style.setProperty("--home-glow-y", String(state.pointerY))
  }, [])

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const tick = useCallback(
    function runTick() {
      const el = ref.current
      if (!el) {
        stopLoop()
        return
      }

      const target = targetRef.current
      const current = currentRef.current
      const smooth = resettingRef.current ? RESET_SMOOTH : POINTER_SMOOTH

      current.rotateX = lerp(current.rotateX, target.rotateX, smooth)
      current.rotateY = lerp(current.rotateY, target.rotateY, smooth)
      current.pointerX = lerp(current.pointerX, target.pointerX, smooth)
      current.pointerY = lerp(current.pointerY, target.pointerY, smooth)

      applyMotion(current)

      const settled =
        Math.abs(current.rotateX - target.rotateX) < SETTLE_EPS &&
        Math.abs(current.rotateY - target.rotateY) < SETTLE_EPS &&
        Math.abs(current.pointerX - target.pointerX) < SETTLE_EPS / 100 &&
        Math.abs(current.pointerY - target.pointerY) < SETTLE_EPS / 100

      if (settled) {
        current.rotateX = target.rotateX
        current.rotateY = target.rotateY
        current.pointerX = target.pointerX
        current.pointerY = target.pointerY
        applyMotion(current)
        stopLoop()

        if (resettingRef.current) {
          resettingRef.current = false
          trackingRef.current = false
          el.classList.remove(trackingClass)
        }
        return
      }

      rafRef.current = requestAnimationFrame(runTick)
    },
    [applyMotion, stopLoop, trackingClass],
  )

  const ensureLoop = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [tick])

  useEffect(() => () => stopLoop(), [stopLoop])

  const onPointerEnter = useCallback(() => {
    const el = ref.current
    if (!el) return
    resettingRef.current = false
    trackingRef.current = true
    el.classList.add(trackingClass)
  }, [trackingClass])

  const resetTilt = useCallback(() => {
    targetRef.current = createIdleMotion(defaultPointerY)
    resettingRef.current = true
    ensureLoop()
  }, [defaultPointerY, ensureLoop])

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLAnchorElement>) => {
      const el = ref.current
      if (!el) return

      resettingRef.current = false
      if (!trackingRef.current) {
        trackingRef.current = true
        el.classList.add(trackingClass)
      }

      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

      targetRef.current = {
        rotateX: (0.5 - y) * TILT,
        rotateY: (x - 0.5) * TILT,
        pointerX: x,
        pointerY: y,
      }
      ensureLoop()
    },
    [ensureLoop, trackingClass],
  )

  return { ref, onPointerEnter, onPointerMove, onPointerLeave: resetTilt }
}
