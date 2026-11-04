export const LISTENING_LANGUAGE_CODES = ["en", "zh", "jp"] as const

export type ListeningLanguageCode = (typeof LISTENING_LANGUAGE_CODES)[number]

export function parseListeningLanguageCode(value: string): ListeningLanguageCode | null {
  if ((LISTENING_LANGUAGE_CODES as readonly string[]).includes(value)) {
    return value as ListeningLanguageCode
  }
  return null
}
