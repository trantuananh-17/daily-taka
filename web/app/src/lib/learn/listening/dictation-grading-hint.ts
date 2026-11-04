import type { DictationGradingDefaults, DictationSentence } from "@/lib/learn/listening/types"

const GRADING_HINT_VI = "Không phân biệt hoa thường và dấu câu"

export function dictationGradingHintLabel(
  sentence: DictationSentence | undefined,
  defaults: DictationGradingDefaults | undefined,
): string | null {
  if (!sentence) return null
  const ignoreCase = sentence.grading?.ignoreCase ?? defaults?.ignoreCase ?? true
  const ignorePunctuation = sentence.grading?.ignorePunctuation ?? defaults?.ignorePunctuation ?? true
  if (ignoreCase && ignorePunctuation) return GRADING_HINT_VI
  if (ignoreCase) return "Không phân biệt hoa thường"
  if (ignorePunctuation) return "Không phân biệt dấu câu"
  return null
}
