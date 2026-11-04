import type { DictationSentence } from "@/lib/learn/listening/types"

/** Active line once playback time reaches that sentence's startMs; null before first cue. */
export function findActiveSentenceIndex(
  sentences: DictationSentence[],
  timeMs: number,
): number | null {
  if (sentences.length === 0) return null

  const timed = sentences.filter((sentence) => sentence.startMs != null)
  if (timed.length === 0) return null

  const firstStart = timed.reduce(
    (min, sentence) => Math.min(min, sentence.startMs!),
    timed[0]!.startMs!,
  )
  if (timeMs < firstStart) return null

  for (let index = sentences.length - 1; index >= 0; index -= 1) {
    const sentence = sentences[index]!
    if (sentence.startMs == null) continue
    if (timeMs >= sentence.startMs) return index
  }

  return null
}
