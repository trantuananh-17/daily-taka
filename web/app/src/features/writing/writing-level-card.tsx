"use client"

import { ArrowRight, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

import { CurriculumCover } from "@/features/vocab/curriculum/curriculum-cover"
import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  getWritingLanguageMeta,
  writingLevelHref,
} from "@/lib/learn/writing/levels"
import type { WritingLevelDef } from "@/lib/learn/writing/types"

type WritingLevelCardProps = {
  language: LanguageHubCode
  level: WritingLevelDef
}

export function WritingLevelCard({ language, level }: WritingLevelCardProps) {
  const router = useRouter()
  const meta = getWritingLanguageMeta(language)
  const href = writingLevelHref(language, level.level)

  return (
    <button
      type="button"
      className={`writing-level-card writing-level-card-${level.cardVariant}`}
      data-difficulty={level.difficulty}
      data-artwork={level.artwork}
      aria-label={level.level}
      style={
        {
          "--identity-h": level.identity.h,
          "--identity-s": level.identity.s,
          "--identity-accent-h": level.identity.accentH,
          "--writing-delay": `${level.animationDelayMs}ms`,
        } as React.CSSProperties
      }
      onClick={() => router.push(href)}
    >
      <span className="writing-level-card-top">
        <span className="writing-level-icon">
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
      <span className="writing-level-card-footer">
        {meta.footerLanguage}
        <span aria-hidden>•</span>
        <span>Luyện viết</span>
      </span>
    </button>
  )
}
