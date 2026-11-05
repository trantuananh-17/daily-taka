import type { ContentLanguageCode } from "@/lib/content-language"

const LANG_KEY = "dailytaka:admin:vocab:language:v1"
const LEVEL_KEY = "dailytaka:admin:vocab:level:v1"

export function parseVocabLanguageParam(value: string | null): ContentLanguageCode | null {
  if (value === "en" || value === "zh" || value === "jp") return value
  return null
}

export function readVocabLanguagePreference(): ContentLanguageCode {
  if (typeof window === "undefined") return "en"
  try {
    const parsed = parseVocabLanguageParam(window.localStorage.getItem(LANG_KEY))
    if (parsed) return parsed
  } catch {
    /* ignore */
  }
  return "en"
}

export function writeVocabLanguagePreference(code: ContentLanguageCode): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(LANG_KEY, code)
  } catch {
    /* ignore */
  }
}

export function readVocabLevelPreference(language: ContentLanguageCode): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(`${LEVEL_KEY}:${language}`)
    return raw?.trim() ? raw : null
  } catch {
    return null
  }
}

export function writeVocabLevelPreference(language: ContentLanguageCode, level: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(`${LEVEL_KEY}:${language}`, level)
  } catch {
    /* ignore */
  }
}
