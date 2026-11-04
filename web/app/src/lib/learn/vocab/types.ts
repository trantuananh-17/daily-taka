import type { LanguageHubCode } from "@/lib/learn/hub"

export type VocabCoverTone = "lavender" | "blue" | "sand" | "sage" | "rose"

export type VocabScene =
  | "learning"
  | "travel"
  | "culture"
  | "nature"
  | "science"
  | "goals"
  | "food"
  | "time"
  | "music"

export type VocabLevelDef = {
  level: string
  scene: VocabScene
  tone: VocabCoverTone
  layout: number
  backdrop: number
  cardVariant: number
  artwork: string
  identity: {
    h: number
    s: string
    accentH: number
  }
  glyph: string
}

export type VocabLanguageMeta = {
  dataLanguage: LanguageHubCode
  footerLanguage: string
  glyph: string
}
