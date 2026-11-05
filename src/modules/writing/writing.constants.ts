export const WRITING_LANGUAGE_CODES = ["en", "zh", "jp"] as const
export type WritingLanguageCode = (typeof WRITING_LANGUAGE_CODES)[number]

export function parseWritingLanguageCode(raw: string): WritingLanguageCode | null {
  if (WRITING_LANGUAGE_CODES.includes(raw as WritingLanguageCode)) {
    return raw as WritingLanguageCode
  }
  return null
}

export function normalizeWritingLevelCode(levelCode: string): string {
  return decodeURIComponent(levelCode).trim()
}
