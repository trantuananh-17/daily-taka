import type { VocabCoverTone, VocabScene } from "@/lib/learn/vocab/types"

/** Shared visual fields for vocab / writing level cards and covers. */
export type CurriculumLevelCover = {
  level: string
  scene: VocabScene
  tone: VocabCoverTone
  layout: number
  backdrop: number
  artwork: string
  identity: {
    h: number
    s: string
    accentH: number
  }
  glyph: string
}
