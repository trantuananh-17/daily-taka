"use client"

import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react"

import { LanguageFlag } from "@/features/landing/language-flag"
import { usePointerCardMotion } from "@/hooks/use-pointer-card-motion"
import type { LanguageOption } from "@/lib/landing/languages"
import { cn } from "@/lib/utils"

const HOME_CLASS: Record<LanguageOption["code"], string> = {
  en: "home-language-en",
  zh: "home-language-zh",
  jp: "home-language-jp",
}

type LanguageCardProps = {
  language: LanguageOption
  index?: number
  className?: string
}

export function LanguageCard({ language, index = 0, className }: LanguageCardProps) {
  const { ref, onPointerEnter, onPointerMove, onPointerLeave } = usePointerCardMotion({
    cardClass: "language-card",
  })

  const cardVars = {
    "--language-color": language.accentColor,
    "--delay": `${index * 80}ms`,
    "--home-glow-x": "0.5",
    "--home-glow-y": "0.38",
  } as CSSProperties

  return (
    <Link
      ref={ref}
      href={language.href}
      className={cn(
        "language-card",
        HOME_CLASS[language.code],
        language.cardTint,
        className,
      )}
      style={cardVars}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="home-language-topline" aria-hidden>
        <span className="flag-orb">
          <LanguageFlag flag={language.flag} />
        </span>
        <span className="home-language-code">{language.codeLabel}</span>
      </span>

      <span className="home-language-art" aria-hidden>
        <svg
          className="home-language-orbit-svg"
          viewBox="0 0 220 188"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              id={`home-sphere-${language.code}`}
              cx="35%"
              cy="32%"
              r="68%"
              fx="28%"
              fy="26%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0.95" />
              <stop
                offset="55%"
                stopColor="currentColor"
                stopOpacity="0.22"
              />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
            </radialGradient>
          </defs>
          <g className="home-language-orbit-group">
            <circle
              className="home-language-core-sphere"
              cx="110"
              cy="96"
              r="34"
              fill={`url(#home-sphere-${language.code})`}
            />
            <ellipse
              className="home-language-orbit-path orbit-outer"
              cx="110"
              cy="96"
              rx="98"
              ry="44"
              transform="rotate(-16 110 96)"
            />
            <ellipse
              className="home-language-orbit-path orbit-inner"
              cx="110"
              cy="98"
              rx="78"
              ry="34"
              transform="rotate(22 110 98)"
            />
            <circle className="home-language-orbit-dot" cx="36" cy="78" r="5" />
            <circle className="home-language-orbit-dot orbit-dot-sm" cx="48" cy="58" r="2.5" />
            <circle className="home-language-orbit-dot orbit-dot-sm" cx="168" cy="88" r="2.5" />
            <circle className="home-language-orbit-dot orbit-dot-faint" cx="152" cy="118" r="3.5" />
          </g>
        </svg>
        <span className="home-language-script-stack">
          <span className="home-language-script-plate" />
          <span className="home-language-script" lang={language.lang}>
            {language.glyph}
          </span>
        </span>
        <span className="home-language-bubble">
          <MessageCircle width={23} height={23} strokeWidth={2} aria-hidden />
        </span>
        <span className="home-language-spark">
          <Sparkles width={23} height={23} strokeWidth={2} aria-hidden />
        </span>
      </span>

      <span className="language-title">
        <b lang={language.lang}>{language.title}</b>
        <small className="home-language-desktop-label">{language.subtitle}</small>
      </span>

      <span className="language-description">{language.description}</span>

      <span className="language-cta">
        <span className="home-language-action-label">Bắt đầu học</span>
        <span className="home-language-arrow" aria-hidden>
          <ArrowRight width={17} height={17} strokeWidth={2} />
        </span>
      </span>
    </Link>
  )
}
