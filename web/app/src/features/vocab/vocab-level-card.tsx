"use client"

import { ArrowRight, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

import { CurriculumCover } from "@/features/vocab/curriculum/curriculum-cover"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getVocabLanguageMeta, vocabLevelHref } from "@/lib/learn/vocab/levels"
import type { VocabLevelDef } from "@/lib/learn/vocab/types"

type VocabLevelCardProps = {
  language: LanguageHubCode
  level: VocabLevelDef
}

export function VocabLevelCard({ language, level }: VocabLevelCardProps) {
  const router = useRouter()
  const meta = getVocabLanguageMeta(language)
  const href = vocabLevelHref(language, level.level)

  return (
    <button
      type="button"
      className={`vocab-level-card vocab-level-card-${level.cardVariant}`}
      data-artwork={level.artwork}
      style={
        {
          "--identity-h": level.identity.h,
          "--identity-s": level.identity.s,
          "--identity-accent-h": level.identity.accentH,
        } as React.CSSProperties
      }
      onClick={() => router.push(href)}
    >
      <span className="vocab-level-card-top">
        <span className="vocab-level-icon">
          <BookOpen width={19} height={19} strokeWidth={2} aria-hidden />
        </span>
        <small>Trình độ</small>
        <ArrowRight width={18} height={18} strokeWidth={2} aria-hidden />
      </span>
      <span className="curriculum-level-body">
        <strong>{level.level}</strong>
        <span className="curriculum-level-art" aria-hidden>
          <CurriculumCover language={language} level={level} />
        </span>
      </span>
      <span className="vocab-level-card-footer">
        {meta.footerLanguage}
        <span aria-hidden>•</span>
        <span>Từ vựng</span>
      </span>
    </button>
  )
}
