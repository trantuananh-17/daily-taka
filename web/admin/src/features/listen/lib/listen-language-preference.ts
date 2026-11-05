import type { ListenLanguageCode } from "@/features/listen/lib/listen-language"

const STORAGE_KEY = "dailytaka:admin:listen:language:v1"

export function parseListenLanguageParam(value: string | null): ListenLanguageCode | null {
  if (value === "en" || value === "zh" || value === "jp") return value
  return null
}

export function readListenLanguagePreference(): ListenLanguageCode {
  if (typeof window === "undefined") return "en"
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = parseListenLanguageParam(raw)
    if (parsed) return parsed
  } catch {
    /* ignore */
  }
  return "en"
}

export function writeListenLanguagePreference(code: ListenLanguageCode): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* ignore quota / private mode */
  }
}
