"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "cn"

import type { WritingInputKind } from "@/lib/learn/writing/types/lesson"
import {
  resolveWritingWordLetterRanges,
  type WritingWordLetterRange,
} from "@/lib/learn/writing/writing-word-hint"
import {
  isWritingAnswerComplete,
  isWritingTypableChar,
  normalizeWritingChar,
  parseWritingTargetCells,
  type WritingTargetCell,
  writingEditableLetterCount,
} from "@/lib/learn/writing/writing-target-cells"

function groupWritingTargetWords(cells: WritingTargetCell[]): WritingTargetCell[][] {
  const groups: WritingTargetCell[][] = []
  let current: WritingTargetCell[] = []

  for (const cell of cells) {
    if (cell.kind === "space") {
      if (current.length > 0) {
        groups.push(current)
        current = []
      }
      continue
    }
    current.push(cell)
  }

  if (current.length > 0) groups.push(current)
  return groups
}

function groupCellsByWordRanges(
  cells: WritingTargetCell[],
  ranges: WritingWordLetterRange[],
): WritingTargetCell[][] {
  const slotToRange = new Map<number, number>()
  ranges.forEach((range, index) => {
    for (let slot = range.start; slot <= range.end; slot += 1) {
      slotToRange.set(slot, index)
    }
  })

  const groups: WritingTargetCell[][] = []
  let current: WritingTargetCell[] = []
  let currentRange: number | undefined

  const flush = () => {
    if (current.length > 0) {
      groups.push(current)
      current = []
    }
  }

  for (const cell of cells) {
    if (cell.kind === "space") {
      flush()
      currentRange = undefined
      continue
    }

    if (cell.kind === "letter") {
      const nextRange = slotToRange.get(cell.slot)
      if (currentRange !== undefined && nextRange !== undefined && nextRange !== currentRange) {
        flush()
      }
      currentRange = nextRange
    }

    current.push(cell)
  }

  flush()
  return groups.length > 0 ? groups : groupWritingTargetWords(cells)
}

function groupCellsByPunctuation(cells: WritingTargetCell[]): WritingTargetCell[][] {
  const groups: WritingTargetCell[][] = []
  let current: WritingTargetCell[] = []

  for (const cell of cells) {
    current.push(cell)
    if (
      cell.kind === "punct" &&
      (cell.char === "、" || cell.char === "。" || cell.char === "，" || cell.char === ",")
    ) {
      groups.push(current)
      current = []
    }
  }

  if (current.length > 0) groups.push(current)
  return groups.length > 1 ? groups : groupWritingTargetWords(cells)
}

function wordGroupLetterRange(group: WritingTargetCell[]): { start: number; end: number } | null {
  let start: number | null = null
  let end: number | null = null
  for (const cell of group) {
    if (cell.kind !== "letter") continue
    if (start === null) start = cell.slot
    end = cell.slot
  }
  if (start === null || end === null) return null
  return { start, end }
}

function wordGroupDisplayText(group: WritingTargetCell[]): string {
  return group
    .map((cell) => (cell.kind === "letter" || cell.kind === "punct" ? cell.char : ""))
    .join("")
}

function isWordGroupComplete(letterRange: { start: number; end: number }, filledLength: number): boolean {
  return filledLength > letterRange.end
}

const MISTAKE_MS = 420

const BLOCKED_NAV_KEYS = new Set([
  "Backspace",
  "Delete",
  " ",
  "Spacebar",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Tab",
])

type WritingBlankInputProps = {
  target: string
  value: string
  onChange: (next: string) => void
  onComplete?: () => void
  disabled?: boolean
  /** Ctrl hint: show expected letters only within this word's slots. */
  hintWordRange?: WritingWordLetterRange | null
  inputKind?: WritingInputKind
  /** Lesson lexicon (`pronunciation[].word`) for CJK word breaks + hints. */
  lexiconWords?: string[]
}

export function WritingBlankInput({
  target,
  value,
  onChange,
  onComplete,
  disabled,
  hintWordRange,
  inputKind = "latin",
  lexiconWords,
}: WritingBlankInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mistakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [mistake, setMistake] = useState<{ slot: number; char: string } | null>(null)

  const cells = useMemo(() => parseWritingTargetCells(target, inputKind), [target, inputKind])
  const wordGroups = useMemo(() => {
    if (inputKind === "cjk" || (lexiconWords?.length ?? 0) > 0) {
      const ranges = resolveWritingWordLetterRanges(target, inputKind, lexiconWords)
      if (ranges.length > 1) return groupCellsByWordRanges(cells, ranges)
      if (inputKind === "cjk") return groupCellsByPunctuation(cells)
    }
    return groupWritingTargetWords(cells)
  }, [cells, inputKind, lexiconWords, target])
  const slotCount = useMemo(() => writingEditableLetterCount(target, inputKind), [target, inputKind])
  const isComplete =
    value.length >= slotCount && isWritingAnswerComplete(target, value, inputKind)
  const cellMinClass = inputKind === "cjk" ? "min-w-[1.85rem] text-base" : "min-w-[1.35rem]"
  const activeSlot = !disabled && !isComplete && value.length < slotCount ? value.length : null

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [target, disabled])

  useEffect(() => {
    if (isWritingAnswerComplete(target, value, inputKind)) {
      onComplete?.()
    }
  }, [target, value, onComplete, inputKind])

  useEffect(() => {
    setMistake(null)
    if (mistakeTimerRef.current) {
      clearTimeout(mistakeTimerRef.current)
      mistakeTimerRef.current = null
    }
  }, [target])

  useEffect(
    () => () => {
      if (mistakeTimerRef.current) clearTimeout(mistakeTimerRef.current)
    },
    [],
  )

  const showMistake = useCallback((slot: number, char: string) => {
    if (mistakeTimerRef.current) clearTimeout(mistakeTimerRef.current)
    setMistake({ slot, char })
    mistakeTimerRef.current = setTimeout(() => {
      setMistake(null)
      mistakeTimerRef.current = null
    }, MISTAKE_MS)
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      const cellsForTarget = parseWritingTargetCells(target, inputKind)
      const expectedLetters = cellsForTarget
        .filter((cell) => cell.kind === "letter")
        .map((cell) => (cell.kind === "letter" ? cell.char : ""))

      if (BLOCKED_NAV_KEYS.has(event.key)) {
        event.preventDefault()
        return
      }

      if (event.key.length !== 1) return

      if (!isWritingTypableChar(event.key, inputKind)) {
        event.preventDefault()
        if (value.length < slotCount) {
          showMistake(value.length, event.key)
        }
        return
      }

      if (value.length >= slotCount) return

      const slot = value.length
      const expected = expectedLetters[slot]
      if (!expected) return

      event.preventDefault()
      if (
        normalizeWritingChar(event.key, inputKind) !== normalizeWritingChar(expected, inputKind)
      ) {
        showMistake(slot, event.key)
        return
      }

      if (mistake) setMistake(null)
      onChange(value + event.key)
    },
    [disabled, inputKind, mistake, onChange, showMistake, slotCount, target, value],
  )

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value=""
        readOnly
        onKeyDown={handleKeyDown}
        onPaste={(event) => event.preventDefault()}
        disabled={disabled}
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
        aria-label="Gõ câu trả lời tiếng Anh"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <div
        className="flex flex-wrap items-end gap-y-3 font-mono text-lg leading-none sm:text-xl"
        aria-hidden
      >
        {wordGroups.map((group, groupIndex) => {
          const letterRange = wordGroupLetterRange(group)
          const wordDone = letterRange ? isWordGroupComplete(letterRange, value.length) : false
          const clusterGap = groupIndex < wordGroups.length - 1 ? "mr-4 sm:mr-5" : ""

          if (wordDone) {
            return (
              <span
                key={`word-${groupIndex}`}
                className={cn("shrink-0 font-medium text-[var(--dlx-ink)]", clusterGap)}
              >
                {wordGroupDisplayText(group)}
              </span>
            )
          }

          return (
            <span
              key={`word-${groupIndex}`}
              className={cn(
                "inline-flex max-w-full shrink-0 flex-wrap items-end gap-x-1 gap-y-2",
                clusterGap,
              )}
            >
              {group.map((cell, cellIndex) => {
                const key = `${groupIndex}-${cellIndex}`
                if (cell.kind === "punct") {
                  return (
                    <span key={key} className="px-0.5 font-body text-[var(--dlx-muted)]">
                      {cell.char}
                    </span>
                  )
                }

                const typed = value[cell.slot]
                const isFilled = Boolean(typed)
                const isMistake = mistake?.slot === cell.slot
                const isActive = activeSlot === cell.slot && !isMistake
                const inHintWord =
                  hintWordRange &&
                  cell.slot >= hintWordRange.start &&
                  cell.slot <= hintWordRange.end
                const hintLetter = inHintWord ? cell.char : null
                const showHint = Boolean(hintLetter) && !isFilled && !isMistake
                const displayChar = isMistake
                  ? mistake.char
                  : isFilled
                    ? cell.char
                    : showHint
                      ? hintLetter
                      : "_"

                return (
                  <span
                    key={key}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md border-2 px-1 py-1.5 font-semibold transition-[border-color,background-color,color] duration-150",
                      cellMinClass,
                      isMistake
                        ? "border-[var(--dlx-destructive,#dc2626)] bg-[color-mix(in_srgb,var(--dlx-destructive,#dc2626)_8%,#fff)] text-[var(--dlx-destructive,#dc2626)]"
                        : isActive
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : showHint
                            ? "border-[color-mix(in_srgb,#c9a227_55%,var(--dlx-hairline))] bg-[color-mix(in_srgb,#f5e6a8_35%,#fff)] text-[#9a7b1a]"
                            : isFilled
                              ? "border-[var(--dlx-hairline)] bg-white text-[var(--dlx-ink)]"
                              : "border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] text-[var(--dlx-muted)]",
                    )}
                  >
                    {displayChar}
                  </span>
                )
              })}
            </span>
          )
        })}
      </div>
    </div>
  )
}
