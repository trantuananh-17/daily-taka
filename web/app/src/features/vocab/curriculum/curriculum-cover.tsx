import type { CSSProperties } from "react"

import { CurriculumCoverArt } from "@/features/vocab/curriculum/curriculum-cover-art"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { CurriculumLevelCover } from "@/lib/learn/curriculum-level"

type CurriculumCoverProps = {
  language: LanguageHubCode
  level: CurriculumLevelCover
}

export function CurriculumCover({ language, level }: CurriculumCoverProps) {
  const style = {
    "--identity-h": level.identity.h,
    "--identity-s": level.identity.s,
    "--identity-accent-h": level.identity.accentH,
  } as CSSProperties

  return (
    <span
      className="topic-cover curriculum-cover"
      data-artwork={level.artwork}
      data-layout={level.layout}
      data-backdrop={level.backdrop}
      data-language={language}
      data-tone={level.tone}
      data-scene={level.scene}
      style={style}
      aria-hidden
    >
      <CurriculumCoverArt level={level} language={language} />
    </span>
  )
}
