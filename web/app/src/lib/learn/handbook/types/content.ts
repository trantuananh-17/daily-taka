/** Cẩm nang (handbook / blog) — list card + article body blocks. */

export type HandbookLanguage = "en" | "zh" | "jp"

/** Shared list + detail header fields */
export type HandbookPostMeta = {
  slug: string
  sortOrder: number
  /** Kicker on card & article, e.g. PHƯƠNG PHÁP DAILY TAKA */
  category: string
  readingTimeMinutes: number
  title: string
  /** Card teaser (2–3 lines) */
  excerpt: string
  /** ISO date `YYYY-MM-DD` */
  publishedAt: string
  /** First card spans full width on catalog grid */
  featured?: boolean
}

export type HandbookTextBlock = {
  kind: "text"
  heading: string
  paragraphs: string[]
}

export type HandbookNumberedListBlock = {
  kind: "numberedList"
  heading: string
  intro?: string
  items: string[]
}

export type HandbookBlock = HandbookTextBlock | HandbookNumberedListBlock

export type HandbookPost = HandbookPostMeta & {
  /** Hero paragraph under title on detail page (may match or expand excerpt) */
  summary: string
  blocks: HandbookBlock[]
}

export type HandbookCollection = {
  language: HandbookLanguage
  slug: string
  /** Small caps line above title, e.g. CẨM NANG DAILY TAKA */
  overline: string
  title: string
  description: string
  posts: HandbookPost[]
}

export type HandbookPostsDocument = {
  collections: HandbookCollection[]
}
