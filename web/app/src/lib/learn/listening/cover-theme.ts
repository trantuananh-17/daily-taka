export type CoverTheme = {
  lightBg: string
  lightWash: string
  lightInk: string
  lightAccent: string
  lightSecondary: string
  darkBg: string
  darkWash: string
  darkInk: string
  darkAccent: string
  darkSecondary: string
}

export type TopicCoverVariant = "en" | "zh" | "jp"

/** Legacy EN tone ids — mapped to theme tokens in mock/API */
export type TopicCoverTone = "sage" | "blue" | "sand" | "rose" | "lavender"

export type TopicCover = {
  variant: TopicCoverVariant
  /** SVG art id (stable for DB); usually same as category slug */
  topicKey: string
  theme: CoverTheme
}
