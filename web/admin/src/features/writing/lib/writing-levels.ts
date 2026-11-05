import type { ContentLanguageCode } from "@/lib/content-language"

/** Mirror `web/app/src/lib/learn/writing/levels.ts`. */
const LEVEL_CODES: Record<ContentLanguageCode, string[]> = {
  en: ["A1", "A2", "B1", "B2", "C1", "C2"],
  zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
  jp: ["N5", "N4", "N3", "N2", "N1"],
}

export function getWritingLevelCodes(language: ContentLanguageCode): string[] {
  return LEVEL_CODES[language]
}

export function parseWritingLevelParam(
  value: string | null,
  language: ContentLanguageCode,
): string | null {
  if (!value) return null
  const decoded = decodeURIComponent(value)
  return getWritingLevelCodes(language).includes(decoded) ? decoded : null
}

export function defaultWritingLevel(language: ContentLanguageCode): string {
  return getWritingLevelCodes(language)[0] ?? "A1"
}
