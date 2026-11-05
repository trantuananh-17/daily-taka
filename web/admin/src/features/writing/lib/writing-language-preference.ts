import type { ContentLanguageCode } from "@/lib/content-language"

const LANG_KEY = "dailytaka:admin:writing:language:v1"
const LEVEL_KEY = "dailytaka:admin:writing:level:v1"

export function parseWritingLanguageParam(value: string | null): ContentLanguageCode | null {
  if (value === "en" || value === "zh" || value === "jp") return value
  return null
}

export function readWritingLanguagePreference(): ContentLanguageCode {
  if (typeof window === "undefined") return "en"
  try {
    const parsed = parseWritingLanguageParam(window.localStorage.getItem(LANG_KEY))
    if (parsed) return parsed
  } catch {
    /* ignore */
  }
  return "en"
}

export function writeWritingLanguagePreference(code: ContentLanguageCode): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(LANG_KEY, code)
  } catch {
    /* ignore */
  }
}

export function readWritingLevelPreference(language: ContentLanguageCode): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(`${LEVEL_KEY}:${language}`)
    return raw?.trim() ? raw : null
  } catch {
    return null
  }
}

export function writeWritingLevelPreference(language: ContentLanguageCode, level: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(`${LEVEL_KEY}:${language}`, level)
  } catch {
    /* ignore */
  }
}
