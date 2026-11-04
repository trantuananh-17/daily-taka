import type { WritingInputKind } from "@/lib/learn/writing/types/lesson"
import {
  normalizeWritingChar,
  parseWritingTargetCells,
  writingEditableLettersFromTarget,
} from "@/lib/learn/writing/writing-target-cells"

export type WritingWordLetterRange = {
  start: number
  end: number
}

const CJK_LONG_PARTICLES = ["について", "から", "まで", "より", "では", "には"]

const CJK_SHORT_PARTICLES = ["の", "は", "が", "を", "に", "で", "と", "へ", "も"]

/** Inclusive slot ranges for each space-delimited Latin word. */
export function writingWordLetterRanges(
  target: string,
  inputKind: WritingInputKind = "latin",
): WritingWordLetterRange[] {
  const cells = parseWritingTargetCells(target, inputKind)
  const ranges: WritingWordLetterRange[] = []
  let start: number | null = null
  let lastLetterSlot: number | null = null

  for (const cell of cells) {
    if (cell.kind === "letter") {
      if (start === null) start = cell.slot
      lastLetterSlot = cell.slot
      continue
    }
    if (cell.kind === "space" && start !== null && lastLetterSlot !== null) {
      ranges.push({ start, end: lastLetterSlot })
      start = null
      lastLetterSlot = null
    }
  }

  if (start !== null && lastLetterSlot !== null) {
    ranges.push({ start, end: lastLetterSlot })
  }

  return ranges
}

/** Match lesson `pronunciation[].word` tokens against the active target (Han / standard JP). */
export function writingWordLetterRangesFromLexicon(
  target: string,
  lexiconWords: string[],
  inputKind: WritingInputKind = "cjk",
): WritingWordLetterRange[] {
  const cells = parseWritingTargetCells(target, inputKind)
  let cellIndex = 0
  const ranges: WritingWordLetterRange[] = []

  for (const word of lexiconWords) {
    const trimmed = word.trim()
    if (!trimmed) continue

    let wordCharIndex = 0
    let start: number | null = null
    let end: number | null = null

    while (cellIndex < cells.length && wordCharIndex < trimmed.length) {
      const cell = cells[cellIndex]
      if (cell.kind === "space" || cell.kind === "punct") {
        cellIndex += 1
        continue
      }
      if (cell.kind === "letter") {
        if (cell.char !== trimmed[wordCharIndex]) {
          return ranges.length > 0 ? ranges : []
        }
        if (start === null) start = cell.slot
        end = cell.slot
        wordCharIndex += 1
        cellIndex += 1
      }
    }

    if (start === null || end === null || wordCharIndex !== trimmed.length) {
      return ranges.length > 0 ? ranges : []
    }
    ranges.push({ start, end })
  }

  return ranges
}

function writingWordLetterRangesCjkHeuristic(
  target: string,
  inputKind: WritingInputKind,
): WritingWordLetterRange[] {
  const cells = parseWritingTargetCells(target, inputKind)
  const letters: { slot: number; char: string }[] = []
  for (const cell of cells) {
    if (cell.kind === "letter") letters.push({ slot: cell.slot, char: cell.char })
  }
  if (!letters.length) return []

  const text = letters.map((row) => row.char).join("")
  const ranges: WritingWordLetterRange[] = []
  let pos = 0

  while (pos < text.length) {
    let matchedParticle = false
    for (const particle of [...CJK_LONG_PARTICLES, ...CJK_SHORT_PARTICLES]) {
      if (!text.startsWith(particle, pos)) continue
      const startSlot = letters[pos]!.slot
      const endSlot = letters[pos + particle.length - 1]!.slot
      ranges.push({ start: startSlot, end: endSlot })
      pos += particle.length
      matchedParticle = true
      break
    }
    if (matchedParticle) continue

    let end = pos + 1
    while (end < text.length) {
      const rest = text.slice(end)
      if (CJK_LONG_PARTICLES.some((particle) => rest.startsWith(particle))) break
      if (CJK_SHORT_PARTICLES.some((particle) => rest.startsWith(particle))) break
      end += 1
    }
    ranges.push({ start: letters[pos]!.slot, end: letters[end - 1]!.slot })
    pos = end
  }

  return ranges
}

export function resolveWritingWordLetterRanges(
  target: string,
  inputKind: WritingInputKind = "latin",
  lexiconWords?: string[],
): WritingWordLetterRange[] {
  const words = lexiconWords?.map((row) => row.trim()).filter(Boolean)
  if (words?.length) {
    const fromLexicon = writingWordLetterRangesFromLexicon(target, words, inputKind)
    if (fromLexicon.length === words.length) return fromLexicon
  }

  if (inputKind === "cjk") {
    const heuristic = writingWordLetterRangesCjkHeuristic(target, inputKind)
    if (heuristic.length) return heuristic
  }

  return writingWordLetterRanges(target, inputKind)
}

function wordIndexForSlot(slot: number, ranges: WritingWordLetterRange[]): number {
  const inside = ranges.findIndex((range) => slot >= range.start && slot <= range.end)
  if (inside >= 0) return inside
  const atStart = ranges.findIndex((range) => range.start === slot)
  if (atStart >= 0) return atStart
  return ranges.findIndex((range) => range.start > slot)
}

/** Word to hint on Ctrl — never the whole sentence. */
function lexiconRangesFullyMatch(
  target: string,
  inputKind: WritingInputKind,
  lexiconWords?: string[],
): boolean {
  const words = lexiconWords?.map((row) => row.trim()).filter(Boolean)
  if (!words?.length) return false
  return writingWordLetterRangesFromLexicon(target, words, inputKind).length === words.length
}

export function resolveHintWordRange(
  target: string,
  filled: string,
  inputKind: WritingInputKind = "latin",
  lexiconWords?: string[],
): WritingWordLetterRange | null {
  const letters = writingEditableLettersFromTarget(target, inputKind)
  const ranges = resolveWritingWordLetterRanges(target, inputKind, lexiconWords)
  const lexiconMatched = lexiconRangesFullyMatch(target, inputKind, lexiconWords)
  if (!ranges.length) return null
  const prefix = letters.slice(0, filled.length)
  const typed = filled
  if (prefix.length !== typed.length) return null
  for (let i = 0; i < prefix.length; i += 1) {
    if (normalizeWritingChar(prefix[i] ?? "", inputKind) !== normalizeWritingChar(typed[i] ?? "", inputKind)) {
      return null
    }
  }

  const slot = filled.length
  if (slot >= letters.length) return null

  let wordIndex = wordIndexForSlot(slot, ranges)
  if (wordIndex < 0) return null

  const range = ranges[wordIndex]!
  if (slot > range.end) {
    wordIndex += 1
    if (wordIndex >= ranges.length) return null
    return trimCjkHintRange(ranges[wordIndex]!, slot, lexiconMatched, inputKind)
  }

  return trimCjkHintRange(range, slot, lexiconMatched, inputKind)
}

/** Kana targets without lexicon match — hint a short chunk, not a long morpheme guess. */
function trimCjkHintRange(
  range: WritingWordLetterRange,
  slot: number,
  lexiconMatched: boolean,
  inputKind: WritingInputKind,
): WritingWordLetterRange {
  if (lexiconMatched || inputKind !== "cjk") return range
  const maxHintLen = 4
  if (range.end - range.start + 1 <= maxHintLen) return range
  const end = Math.min(Math.max(slot, range.start) + maxHintLen - 1, range.end)
  return { start: slot, end }
}
