"use client"

import Link from "next/link"
import { ArrowRight, Headphones, LibraryBig, PencilLine } from "lucide-react"
import type { CSSProperties } from "react"
import type { LucideIcon } from "lucide-react"

import { LanguageFeatureArt } from "@/features/english/language-feature-art"
import { usePointerCardMotion } from "@/hooks/use-pointer-card-motion"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { LANGUAGE_HUBS } from "@/lib/learn/hub"
import type { FeatureKind, LanguageFeature } from "@/lib/learn/features"
import { cn } from "@/lib/utils"

import "./english-feature-card.css"

const FEATURE_ICONS: Record<FeatureKind, LucideIcon> = {
  listening: Headphones,
  vocab: LibraryBig,
  writing: PencilLine,
}

type EnglishFeatureCardProps = {
  feature: LanguageFeature
  language: LanguageHubCode
  index?: number
}

export function EnglishFeatureCard({ feature, language, index = 0 }: EnglishFeatureCardProps) {
  const { ref, onPointerEnter, onPointerMove, onPointerLeave } = usePointerCardMotion({
    cardClass: "english-feature-card",
  })

  const Icon = FEATURE_ICONS[feature.id]
  const dataLanguage = LANGUAGE_HUBS[language].dataLanguage

  const style = {
    "--feature-color": feature.accentColor,
    "--feature-accent": feature.accentColor,
    "--card-bg": feature.cardBg,
    "--delay": `${index * 80}ms`,
    "--home-glow-x": "0.5",
    "--home-glow-y": "0.38",
  } as CSSProperties

  return (
    <Link
      ref={ref}
      href={feature.href}
      className={cn("english-feature-card", feature.cardClass)}
      style={style}
      data-language={dataLanguage}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="english-feature-topline" aria-hidden>
        <span className="english-feature-icon">
          <Icon width={18} height={18} strokeWidth={2} aria-hidden />
        </span>
        <span className="english-feature-number">{feature.number}</span>
      </span>

      <span className="english-feature-art" aria-hidden>
        <LanguageFeatureArt variant={feature.id} locale={language} />
      </span>

      <h2>{feature.title}</h2>
      <p>
        <span className="feature-copy-wide">{feature.descriptionWide}</span>
        <span className="feature-copy-mobile">{feature.descriptionMobile}</span>
      </p>

      <span className="english-feature-cta">
        <span className="english-feature-action-label">Bắt đầu học</span>
        <span className="english-feature-arrow" aria-hidden>
          <ArrowRight width={18} height={18} strokeWidth={2} />
        </span>
      </span>
    </Link>
  )
}
