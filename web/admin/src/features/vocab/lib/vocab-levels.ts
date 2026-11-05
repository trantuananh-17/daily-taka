import type { ContentLanguageCode } from "@/lib/content-language"

/** Level codes — mirror `web/app/src/lib/learn/vocab/levels.ts` (field `level` only). */
const LEVEL_CODES: Record<ContentLanguageCode, string[]> = {
  en: ["A1", "A2", "B1", "B2", "C1", "C2"],
  zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
  jp: ["N5", "N4", "N3", "N2", "N1"],
}

export function getVocabLevelCodes(language: ContentLanguageCode): string[] {
  return LEVEL_CODES[language]
}

export function parseVocabLevelParam(value: string | null, language: ContentLanguageCode): string | null {
  if (!value) return null
  const decoded = decodeURIComponent(value)
  return getVocabLevelCodes(language).includes(decoded) ? decoded : null
}

export function defaultVocabLevel(language: ContentLanguageCode): string {
  return getVocabLevelCodes(language)[0] ?? "A1"
}
