import type { WritingScriptModeDef, WritingSentence } from "@/lib/learn/writing/types/lesson"

export function resolveWritingSentenceTarget(
  sentence: WritingSentence,
  scriptModeId: string | null,
): string {
  if (!scriptModeId || scriptModeId === "han" || scriptModeId === "standard") {
    return sentence.target
  }
  if (sentence.targetsByMode?.[scriptModeId]) {
    return sentence.targetsByMode[scriptModeId]!
  }
  return sentence.target
}

export function resolveWritingInputKind(
  scriptModes: WritingScriptModeDef[] | undefined,
  scriptModeId: string,
): "latin" | "cjk" {
  const mode = scriptModes?.find((row) => row.id === scriptModeId)
  return mode?.inputKind ?? "latin"
}
