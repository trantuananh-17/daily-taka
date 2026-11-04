import type { WritingInputKind } from "@/lib/learn/writing/types/lesson"

export type WritingTargetCell =
  | { kind: "letter"; char: string; slot: number }
  | { kind: "space" }
  | { kind: "punct"; char: string }

const CJK_EDITABLE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u

function isEditableChar(char: string, inputKind: WritingInputKind): boolean {
  if (inputKind === "cjk") return CJK_EDITABLE.test(char)
  return /[A-Za-z]/.test(char)
}

export function isWritingTypableChar(char: string, inputKind: WritingInputKind): boolean {
  return isEditableChar(char, inputKind)
}

/** Split target into editable slots vs visible punctuation/spaces. */
export function parseWritingTargetCells(
  target: string,
  inputKind: WritingInputKind = "latin",
): WritingTargetCell[] {
  const cells: WritingTargetCell[] = []
  let slot = 0
  for (const char of target) {
    if (char === " ") {
      cells.push({ kind: "space" })
      continue
    }
    if (isEditableChar(char, inputKind)) {
      cells.push({ kind: "letter", char, slot })
      slot += 1
      continue
    }
    cells.push({ kind: "punct", char })
  }
  return cells
}

export function writingEditableLetterCount(
  target: string,
  inputKind: WritingInputKind = "latin",
): number {
  return parseWritingTargetCells(target, inputKind).filter((cell) => cell.kind === "letter").length
}

export function normalizeWritingChar(char: string, inputKind: WritingInputKind = "latin"): string {
  if (inputKind === "cjk") return char
  return char.toLowerCase()
}

export function writingEditableLettersFromTarget(
  target: string,
  inputKind: WritingInputKind = "latin",
): string {
  return parseWritingTargetCells(target, inputKind)
    .filter((cell): cell is Extract<WritingTargetCell, { kind: "letter" }> => cell.kind === "letter")
    .map((cell) => cell.char)
    .join("")
}

export function isWritingAnswerComplete(
  target: string,
  filled: string,
  inputKind: WritingInputKind = "latin",
): boolean {
  const expected = writingEditableLetterCount(target, inputKind)
  if (filled.length !== expected) return false
  const cells = parseWritingTargetCells(target, inputKind)
  let slot = 0
  for (const cell of cells) {
    if (cell.kind !== "letter") continue
    if (
      normalizeWritingChar(filled[slot] ?? "", inputKind) !==
      normalizeWritingChar(cell.char, inputKind)
    ) {
      return false
    }
    slot += 1
  }
  return true
}

/** @deprecated use normalizeWritingChar */
export function normalizeWritingLetter(char: string): string {
  return normalizeWritingChar(char, "latin")
}
