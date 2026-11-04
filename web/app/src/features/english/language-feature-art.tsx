import type { LanguageHubCode } from "@/lib/learn/hub"
import type { FeatureKind } from "@/lib/learn/features"

type ArtProps = {
  variant: FeatureKind
  locale: LanguageHubCode
}

function ArtSparks() {
  return (
    <>
      <ellipse cx="160" cy="110" rx="100" ry="68" className="feature-art-halo" />
      <ellipse cx="164" cy="165" rx="83" ry="8" className="feature-art-shadow" />
      <path
        d="m60 49 3-8 3 8 8 3-8 3-3 8-3-8-8-3Zm196 77 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z"
        className="feature-art-spark"
      />
      <circle cx="258" cy="48" r="4" className="feature-art-spark" />
      <circle cx="64" cy="133" r="3" className="feature-art-spark" />
    </>
  )
}

function ArtLocaleBackdrop({ locale }: { locale: LanguageHubCode }) {
  if (locale === "zh") {
    return (
      <g stroke="currentColor" strokeWidth="1" opacity=".22">
        <circle cx="160" cy="105" r="77" />
        <path d="M38 61V35h26m192 126h26v-26M253 44h23a7 7 0 1 0-7-7m-23 7h-11" />
      </g>
    )
  }
  if (locale === "jp") {
    return (
      <g stroke="currentColor" strokeWidth="1" opacity=".2">
        <circle cx="258" cy="43" r="13" className="feature-art-accent-fill" stroke="none" />
        <path d="M25 171a22 22 0 0 1 44 0m-38 0a16 16 0 0 1 32 0m6 0a22 22 0 0 1 44 0m-38 0a16 16 0 0 1 32 0" />
      </g>
    )
  }
  return null
}

function ArtListening({ locale }: { locale: LanguageHubCode }) {
  return (
    <svg viewBox="0 0 320 192" fill="none" focusable="false" aria-hidden>
      <ArtSparks />
      <ArtLocaleBackdrop locale={locale} />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <g className="feature-art-back">
          <rect
            x="86"
            y="51"
            width="151"
            height="100"
            rx="14"
            transform="rotate(8 161 101)"
            className="feature-art-accent"
          />
        </g>
        <g className="feature-art-main">
          <rect x="76" y="47" width="164" height="106" rx="14" className="feature-art-paper" />
          <circle cx="100" cy="66" r="3" className="feature-art-accent" stroke="none" />
          {locale === "en" ? (
            <path d="M110 66h34" opacity=".35" />
          ) : locale === "zh" ? (
            <text x="112" y="70" stroke="none" fill="currentColor" fontSize="12" fontFamily="serif">
              听力
            </text>
          ) : (
            <text x="112" y="70" stroke="none" fill="currentColor" fontSize="12" fontFamily="serif">
              聴く
            </text>
          )}
          <circle cx="110" cy="112" r="18" className="feature-art-soft" />
          <path d="m106 104 12 8-12 8Z" className="feature-art-ink" stroke="none" />
          <g className="feature-art-wave" strokeWidth="4">
            <path d="M148 103v18" />
            <path d="M160 95v34" />
            <path d="M172 87v50" />
            <path d="M184 98v28" />
            <path d="M196 91v42" />
            <path d="M208 103v18" />
          </g>
        </g>
        <g className="feature-art-float">
          <rect x="197" y="27" width="55" height="48" rx="13" className="feature-art-paper" />
          <path d="M211 52v-4a13 13 0 0 1 26 0v4" />
          <rect x="209" y="49" width="7" height="13" rx="3" className="feature-art-accent" />
          <rect x="232" y="49" width="7" height="13" rx="3" className="feature-art-accent" />
        </g>
        <g className="feature-art-float-alt">
          <rect x="56" y="132" width="87" height="33" rx="10" className="feature-art-paper" />
          <path d="m69 148 4 4 8-9M89 145h38M89 152h25" />
        </g>
      </g>
    </svg>
  )
}

function ArtVocab({ locale }: { locale: LanguageHubCode }) {
  return (
    <svg viewBox="0 0 320 192" fill="none" focusable="false" aria-hidden>
      <ArtSparks />
      <ArtLocaleBackdrop locale={locale} />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <g className="feature-art-back">
          <rect
            x="96"
            y="40"
            width="123"
            height="112"
            rx="14"
            transform="rotate(12 157 96)"
            className="feature-art-accent"
          />
        </g>
        <g className="feature-art-main">
          <rect
            x="91"
            y="35"
            width="123"
            height="118"
            rx="14"
            transform="rotate(-7 152 94)"
            className="feature-art-paper"
          />
          {locale === "en" ? (
            <path
              d="M116 93 130 58l14 35m-23-11h18M155 83c0-17 20-17 20 0v10m0-10c0 16-20 16-20 0"
              strokeWidth="3.5"
            />
          ) : locale === "zh" ? (
            <text x="131" y="98" stroke="none" fill="currentColor" fontSize="48" fontFamily="serif">
              词
            </text>
          ) : (
            <text x="131" y="98" stroke="none" fill="currentColor" fontSize="48" fontFamily="serif">
              あ
            </text>
          )}
          <path d="M116 115h64M125 124h46" opacity=".4" />
          <path d="m183 45 1 17 6-4 6 3-1-18" className="feature-art-accent" />
        </g>
        <g className="feature-art-float">
          <rect x="202" y="89" width="54" height="49" rx="13" className="feature-art-paper" />
          <path d="m217 113 8 8 14-17" strokeWidth="3" />
        </g>
        <g className="feature-art-float-alt">
          <rect x="57" y="56" width="49" height="40" rx="11" className="feature-art-paper" />
          <path d="m74 75 7-8 7 8-7 8Z" className="feature-art-accent" />
        </g>
      </g>
    </svg>
  )
}

function ArtWriting({ locale }: { locale: LanguageHubCode }) {
  return (
    <svg viewBox="0 0 320 192" fill="none" focusable="false" aria-hidden>
      <ArtSparks />
      <ArtLocaleBackdrop locale={locale} />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <g className="feature-art-back">
          <rect
            x="101"
            y="38"
            width="123"
            height="116"
            rx="12"
            transform="rotate(9 162 96)"
            className="feature-art-accent"
          />
        </g>
        <g className="feature-art-main">
          <rect
            x="89"
            y="31"
            width="123"
            height="127"
            rx="12"
            transform="rotate(-5 150 94)"
            className="feature-art-paper"
          />
          {locale === "en" ? (
            <path d="M112 61h75M112 78h65M112 95h75M112 112h47" opacity=".35" />
          ) : locale === "zh" ? (
            <>
              <text x="110" y="95" stroke="none" fill="currentColor" fontSize="32" fontFamily="serif">
                写
              </text>
              <path d="M153 61h34m-34 16h24m-65 35h47" opacity=".35" />
            </>
          ) : (
            <>
              <text x="110" y="95" stroke="none" fill="currentColor" fontSize="32" fontFamily="serif">
                書
              </text>
              <path d="M153 61h34m-34 16h24m-65 35h47" opacity=".35" />
            </>
          )}
          <path d="M108 132h36" strokeWidth="3" />
          <path d="m186 55 12 8-43 65-17 10 3-19Z" className="feature-art-accent" />
          <path d="m141 119 14 9m30-69 13 8m-60 71 3-11 7 6" />
        </g>
        <g className="feature-art-float">
          <circle cx="227" cy="127" r="23" className="feature-art-paper" />
          <path d="m217 126 7 8 13-15" strokeWidth="3" />
        </g>
        <g className="feature-art-float-alt">
          <rect x="57" y="48" width="53" height="39" rx="11" className="feature-art-paper" />
          <path d="M70 61h27m-27 9h16" />
        </g>
      </g>
    </svg>
  )
}

export function LanguageFeatureArt({ variant, locale }: ArtProps) {
  switch (variant) {
    case "listening":
      return <ArtListening locale={locale} />
    case "vocab":
      return <ArtVocab locale={locale} />
    case "writing":
      return <ArtWriting locale={locale} />
  }
}
