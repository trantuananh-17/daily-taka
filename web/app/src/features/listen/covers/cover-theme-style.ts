import type { CSSProperties } from "react"

import type { CoverTheme, TopicCoverVariant } from "@/lib/learn/listening/cover-theme"

export function coverThemeStyle(
  variant: TopicCoverVariant,
  theme: CoverTheme,
): CSSProperties {
  const p = variant
  return {
    [`--${p}-light-bg`]: theme.lightBg,
    [`--${p}-light-wash`]: theme.lightWash,
    [`--${p}-light-ink`]: theme.lightInk,
    [`--${p}-light-accent`]: theme.lightAccent,
    [`--${p}-light-secondary`]: theme.lightSecondary,
    [`--${p}-dark-bg`]: theme.darkBg,
    [`--${p}-dark-wash`]: theme.darkWash,
    [`--${p}-dark-ink`]: theme.darkInk,
    [`--${p}-dark-accent`]: theme.darkAccent,
    [`--${p}-dark-secondary`]: theme.darkSecondary,
  } as CSSProperties
}
