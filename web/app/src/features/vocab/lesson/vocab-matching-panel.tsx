"use client"

import { ArrowRight, Check, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { shuffleSeeded } from "@/lib/learn/shuffle-seeded"
import type { VocabWord } from "@/lib/learn/vocab/types/lesson-story"

type Connection = {
  termId: string
  meaning: string
  animate: boolean
}

type LineCoords = { x1: number; y1: number; x2: number; y2: number; d: string }

type VocabMatchingPanelProps = {
  words: VocabWord[]
  shuffleSeed: string
  onProgress: (matched: number, total: number) => void
  onWeakWord: (wordId: string) => void
  onContinue: () => void
}

export function VocabMatchingPanel({
  words,
  shuffleSeed,
  onProgress,
  onWeakWord,
  onContinue,
}: VocabMatchingPanelProps) {
  const total = words.length
  const [leftWords] = useState(() => shuffleSeeded(words, `${shuffleSeed}:left`))
  const [rightItems] = useState(() =>
    shuffleSeeded(
      words.map((w) => ({ id: w.id, meaning: w.meaningVi })),
      `${shuffleSeed}:right`,
    ),
  )

  const [connections, setConnections] = useState<Connection[]>([])
  const [anchorTermId, setAnchorTermId] = useState<string | null>(null)
  const [anchorMeaning, setAnchorMeaning] = useState<string | null>(null)
  const [errorPair, setErrorPair] = useState<{ termId: string; meaning: string } | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [lines, setLines] = useState<Record<string, LineCoords>>({})

  const boardRef = useRef<HTMLDivElement>(null)
  const termRefs = useRef(new Map<string, HTMLButtonElement>())
  const meaningRefs = useRef(new Map<string, HTMLButtonElement>())

  const matchedTermIds = useMemo(() => new Set(connections.map((c) => c.termId)), [connections])
  const matchedMeanings = useMemo(() => new Set(connections.map((c) => c.meaning)), [connections])

  const recomputeLines = useCallback(() => {
    const board = boardRef.current
    if (!board) return
    const boardRect = board.getBoundingClientRect()
    const next: Record<string, LineCoords> = {}

    for (const conn of connections) {
      const termEl = termRefs.current.get(conn.termId)
      const meaningEl = meaningRefs.current.get(conn.meaning)
      if (!termEl || !meaningEl) continue

      const tr = termEl.getBoundingClientRect()
      const mr = meaningEl.getBoundingClientRect()
      const x1 = tr.right - boardRect.left
      const y1 = tr.top + tr.height / 2 - boardRect.top
      const x2 = mr.left - boardRect.left
      const y2 = mr.top + mr.height / 2 - boardRect.top
      const bend = Math.min(72, Math.max(32, (x2 - x1) * 0.35))
      const d = `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`
      next[`${conn.termId}::${conn.meaning}`] = { x1, y1, x2, y2, d }
    }

    setLines(next)
  }, [connections])

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => recomputeLines())
    return () => window.cancelAnimationFrame(frame)
  }, [connections, recomputeLines, leftWords, rightItems])

  useEffect(() => {
    const board = boardRef.current
    if (!board) return
    const ro = new ResizeObserver(() => recomputeLines())
    ro.observe(board)
    window.addEventListener("resize", recomputeLines)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", recomputeLines)
    }
  }, [recomputeLines])

  useEffect(() => {
    onProgress(connections.length, total)
  }, [connections.length, onProgress, total])

  function clearAnchors() {
    setAnchorTermId(null)
    setAnchorMeaning(null)
  }

  function tryConnect(termId: string, meaning: string) {
    if (errorPair) return
    if (matchedTermIds.has(termId) || matchedMeanings.has(meaning)) return

    const word = words.find((w) => w.id === termId)
    if (!word) return

    if (word.meaningVi === meaning) {
      setConnections((prev) => [...prev, { termId, meaning, animate: true }])
      setFeedback("Chính xác! Cặp thẻ đã được ghép.")
      clearAnchors()
      window.setTimeout(() => {
        setConnections((prev) =>
          prev.map((c) => (c.termId === termId && c.meaning === meaning ? { ...c, animate: false } : c)),
        )
      }, 600)
      return
    }

    setErrorPair({ termId, meaning })
    onWeakWord(termId)
    setFeedback("Chưa đúng — thử cặp khác.")
    window.setTimeout(() => {
      setErrorPair(null)
      clearAnchors()
      setFeedback(null)
    }, 620)
  }

  function onTermClick(termId: string) {
    if (matchedTermIds.has(termId) || errorPair) return
    if (anchorMeaning !== null) {
      tryConnect(termId, anchorMeaning)
      return
    }
    setAnchorTermId((current) => (current === termId ? null : termId))
    setAnchorMeaning(null)
  }

  function onMeaningClick(meaning: string) {
    if (matchedMeanings.has(meaning) || errorPair) return
    if (anchorTermId !== null) {
      tryConnect(anchorTermId, meaning)
      return
    }
    setAnchorMeaning((current) => (current === meaning ? null : meaning))
    setAnchorTermId(null)
  }

  function resetAll() {
    setConnections([])
    clearAnchors()
    setErrorPair(null)
    setFeedback(null)
    setLines({})
  }

  return (
    <>
      <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--dlx-primary)]">Ghép thẻ</p>
      <h2 className="mt-1 mb-0 font-heading text-lg font-bold text-[var(--dlx-ink)]">Ghép từ với nghĩa</h2>
      <p className="mt-1 font-body text-sm text-[var(--dlx-muted)]">
        Chọn một từ và một nghĩa — đúng sẽ có sợi dây nối hai thẻ. {connections.length}/{total} đã ghép
      </p>

      <div ref={boardRef} className="relative isolate mt-4 min-h-48">
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" aria-hidden>
          {connections.map((conn) => {
            const key = `${conn.termId}::${conn.meaning}`
            const line = lines[key]
            if (!line) return null
            return (
              <path
                key={key}
                d={line.d}
                className={cn(
                  "fill-none stroke-[#22c55e] stroke-[2.5] [stroke-linecap:round] drop-shadow-[0_1px_2px_color-mix(in_srgb,#15803d_25%,transparent)]",
                  conn.animate && "[stroke-dasharray:1] [stroke-dashoffset:1] animate-vocab-match-string-draw",
                )}
                pathLength={1}
              />
            )
          })}
        </svg>

        <div className="relative z-[1] grid gap-3 md:grid-cols-2 md:gap-8">
          <ul className="m-0 list-none space-y-2 p-0">
            {leftWords.map((word) => {
              const matched = matchedTermIds.has(word.id)
              const selected = anchorTermId === word.id
              const errored = errorPair?.termId === word.id
              return (
                <li key={word.id}>
                  <button
                    ref={(el) => {
                      if (el) termRefs.current.set(word.id, el)
                      else termRefs.current.delete(word.id)
                    }}
                    type="button"
                    disabled={matched || Boolean(errorPair)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border-2 border-[var(--dlx-hairline)] bg-white px-3 py-2.5 text-left font-body text-sm transition-colors",
                      matched &&
                        "cursor-default border-[#22c55e] bg-[#f0fdf4] text-[#14532d] opacity-100 disabled:opacity-100",
                      selected &&
                        !matched &&
                        "border-[#15803d] bg-[color-mix(in_srgb,#15803d_8%,#fff)] shadow-[0_0_0_3px_color-mix(in_srgb,#15803d_18%,transparent)]",
                      errored &&
                        "animate-vocab-match-error border-[#ef4444] bg-[color-mix(in_srgb,#ef4444_6%,#fff)]",
                    )}
                    onClick={() => onTermClick(word.id)}
                  >
                    {word.term}
                    {matched ? <Check className="size-4 shrink-0 text-green-600" aria-hidden /> : null}
                  </button>
                </li>
              )
            })}
          </ul>

          <ul className="m-0 list-none space-y-2 p-0">
            {rightItems.map((item) => {
              const matched = matchedMeanings.has(item.meaning)
              const selected = anchorMeaning === item.meaning
              const errored = errorPair?.meaning === item.meaning
              return (
                <li key={`${item.id}-${item.meaning}`}>
                  <button
                    ref={(el) => {
                      if (el) meaningRefs.current.set(item.meaning, el)
                      else meaningRefs.current.delete(item.meaning)
                    }}
                    type="button"
                    disabled={matched || Boolean(errorPair)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border-2 border-[var(--dlx-hairline)] bg-white px-3 py-2.5 text-left font-body text-sm transition-colors",
                      matched &&
                        "cursor-default border-[#22c55e] bg-[#f0fdf4] text-[#14532d] opacity-100 disabled:opacity-100",
                      selected &&
                        !matched &&
                        "border-[#15803d] bg-[color-mix(in_srgb,#15803d_8%,#fff)] shadow-[0_0_0_3px_color-mix(in_srgb,#15803d_18%,transparent)]",
                      errored &&
                        "animate-vocab-match-error border-[#ef4444] bg-[color-mix(in_srgb,#ef4444_6%,#fff)]",
                    )}
                    onClick={() => onMeaningClick(item.meaning)}
                  >
                    {item.meaning}
                    {matched ? <Check className="size-4 shrink-0 text-green-600" aria-hidden /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {feedback ? (
        <p
          className={cn(
            "mt-3 text-center text-sm font-medium",
            errorPair ? "text-red-600" : "text-[var(--dlx-primary)]",
          )}
        >
          {feedback}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap justify-between gap-2">
        <Button type="button" variant="outline" onClick={resetAll}>
          <RotateCcw className="mr-2 size-4" aria-hidden />
          Làm lại
        </Button>
        <Button
          type="button"
          className="dlx-btn-primary gap-2"
          disabled={connections.length < total}
          onClick={onContinue}
        >
          Bắt đầu quiz
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </>
  )
}
