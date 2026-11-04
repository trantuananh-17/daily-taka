import type { DictationGradingDefaults, DictationSentence } from "@/lib/learn/listening/types"

export type DictationGradingConfig = {
  ignoreCase: boolean
  ignorePunctuation: boolean
}

/** Sentence punctuation — not graded, not shown in hints. */
const STRIP_PUNCT_RE = /[.,!?;:。、！？「」『』【】]+/g

export function resolveDictationGrading(
  sentence: DictationSentence | undefined,
  defaults: DictationGradingDefaults | undefined,
): DictationGradingConfig {
  return {
    ignoreCase: sentence?.grading?.ignoreCase ?? defaults?.ignoreCase ?? true,
    ignorePunctuation: sentence?.grading?.ignorePunctuation ?? defaults?.ignorePunctuation ?? true,
  }
}

export function tokenizeDictationText(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

export function stripDictationPunctuation(word: string): string {
  return word.replace(STRIP_PUNCT_RE, "")
}

export function normalizeDictationToken(token: string, grading: DictationGradingConfig): string {
  let value = stripDictationPunctuation(token)
  if (grading.ignoreCase) {
    value = value.toLowerCase()
  }
  return value
}

export function normalizeDictationSentence(text: string, grading: DictationGradingConfig): string {
  return tokenizeDictationText(text)
    .map((token) => normalizeDictationToken(token, grading))
    .join(" ")
}

/** Consecutive expected words matched from the start of the user's answer. */
export function countLeadingCorrectWords(
  expectedWords: string[],
  userWords: string[],
  grading: DictationGradingConfig,
): number {
  let count = 0
  for (let index = 0; index < expectedWords.length; index += 1) {
    const user = userWords[index]
    if (user === undefined) break
    const expected = normalizeDictationToken(expectedWords[index] ?? "", grading)
    const normalizedUser = normalizeDictationToken(user, grading)
    if (expected !== normalizedUser) break
    count += 1
  }
  return count
}

/** Characters allowed while typing dictation (punctuation optional; grading may ignore it). */
const DICTATION_INPUT_ALLOWED_RE = /^[\p{L}\p{N}\s'.,!?;:。、！？「」『』【】\-]*$/u

export function sanitizeDictationInput(value: string): string {
  return value.replace(/[^\p{L}\p{N}\s'.,!?;:。、！？「」『』【】\-]/gu, "")
}

export function isDictationAnswerSubmittable(answer: string): boolean {
  const trimmed = answer.trim()
  if (trimmed.length === 0) return false
  return DICTATION_INPUT_ALLOWED_RE.test(answer)
}

export function findWrongWordIndices(
  expectedWords: string[],
  userWords: string[],
  grading: DictationGradingConfig,
): number[] {
  const wrong: number[] = []
  for (let index = 0; index < expectedWords.length; index += 1) {
    const expected = normalizeDictationToken(expectedWords[index] ?? "", grading)
    const user = normalizeDictationToken(userWords[index] ?? "", grading)
    if (expected !== user) wrong.push(index)
  }
  return wrong
}

export function isDictationAnswerCorrect(
  expectedTranscript: string,
  userAnswer: string,
  grading: DictationGradingConfig,
): boolean {
  const expectedWords = tokenizeDictationText(expectedTranscript)
  const userWords = tokenizeDictationText(userAnswer)
  if (userWords.length !== expectedWords.length) return false
  return findWrongWordIndices(expectedWords, userWords, grading).length === 0
}

const DICTATION_HINT_MASK = "_"

/** Visible letters + `_` for the rest (no `.` `,` in output). */
export function formatPartialDictationWord(word: string, visibleLetterCount: number): string {
  const clean = stripDictationPunctuation(word)
  if (clean.length === 0) return ""
  const visible = Math.min(Math.max(visibleLetterCount, 0), clean.length)
  if (visible <= 0) return DICTATION_HINT_MASK.repeat(clean.length)
  if (visible >= clean.length) return clean
  return `${clean.slice(0, visible)}${DICTATION_HINT_MASK.repeat(clean.length - visible)}`
}

/**
 * After a wrong check: show completed prefix words in full, first letter of the next word only, rest `_`.
 * Example: "Today" checked → `Today i_ ____`; "Today is" → `Today is N____ …`.
 */
export function buildDictationHintLine(
  expectedWords: string[],
  userWords: string[],
  grading: DictationGradingConfig,
): string {
  const leading = countLeadingCorrectWords(expectedWords, userWords, grading)
  const hintIndex = Math.min(leading, expectedWords.length - 1)

  return expectedWords
    .map((word, index) => {
      if (index < leading) {
        return stripDictationPunctuation(word)
      }
      if (index === hintIndex) {
        return formatPartialDictationWord(word, 1)
      }
      return formatPartialDictationWord(word, 0)
    })
    .join(" ")
}

export type DictationCheckResult = {
  correct: boolean
  wrongIndices: number[]
  hintLine: string | null
}

export function checkDictationAnswer(
  expectedTranscript: string,
  userAnswer: string,
  grading: DictationGradingConfig,
): DictationCheckResult {
  const expectedWords = tokenizeDictationText(expectedTranscript)
  const userWords = tokenizeDictationText(userAnswer)
  const wrongIndices =
    userAnswer.trim() === ""
      ? expectedWords.map((_, index) => index)
      : findWrongWordIndices(expectedWords, userWords, grading)

  const correct = isDictationAnswerCorrect(expectedTranscript, userAnswer, grading)

  if (correct) {
    return { correct: true, wrongIndices: [], hintLine: null }
  }

  const hintLine = buildDictationHintLine(expectedWords, userWords, grading)

  return { correct: false, wrongIndices, hintLine }
}
