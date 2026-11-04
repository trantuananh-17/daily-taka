import type { DictationLessonDetail, DictationSentence } from "@/lib/learn/listening/types"

type SentenceWire = DictationSentence & {
  start_ms?: number
  end_ms?: number
  position?: number
}

function normalizeSentence(row: SentenceWire): DictationSentence {
  const startMs = row.startMs ?? row.start_ms
  const endMs = row.endMs ?? row.end_ms
  const index = row.index ?? row.position ?? 0
  return {
    ...row,
    index,
    startMs: startMs ?? undefined,
    endMs: endMs ?? undefined,
  }
}

/** API / cache may use camelCase or legacy snake_case on sentences. */
export function normalizeDictationLessonDetail(
  detail: DictationLessonDetail & { sentences?: SentenceWire[] },
): DictationLessonDetail {
  return {
    ...detail,
    sentences: (detail.sentences ?? []).map(normalizeSentence),
  }
}

export function sentencePlaybackWindow(
  sentence: DictationSentence | undefined,
  lessonDurationMs: number,
): { startMs: number; endMs: number } | null {
  if (!sentence) return null
  const startMs = sentence.startMs
  const endMs = sentence.endMs
  if (startMs != null && endMs != null && endMs > startMs) {
    return { startMs, endMs }
  }
  if (startMs != null) {
    return { startMs, endMs: startMs + 4000 }
  }
  if (lessonDurationMs > 0) {
    return { startMs: 0, endMs: lessonDurationMs }
  }
  return null
}
