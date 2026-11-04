import type { LanguageHubCode } from "@/lib/learn/hub"
import type { CurriculumLevelCover } from "@/lib/learn/curriculum-level"

export type WritingDifficulty = "easy" | "medium" | "hard"

export type WritingLevelDef = CurriculumLevelCover & {
  cardVariant: number
  difficulty: WritingDifficulty
  animationDelayMs: number
}

export type WritingLanguageMeta = {
  dataLanguage: LanguageHubCode
  footerLanguage: string
}
