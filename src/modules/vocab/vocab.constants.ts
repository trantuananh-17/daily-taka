import type { ListeningLanguageCode } from "../listening/listening.constants"
import { parseListeningLanguageCode } from "../listening/listening.constants"

export type VocabLanguageCode = ListeningLanguageCode

export function parseVocabLanguageCode(raw: string): VocabLanguageCode | null {
  return parseListeningLanguageCode(raw)
}

export function normalizeVocabLevelCode(raw: string): string {
  return raw.trim().toUpperCase()
}

export function slugifyTopicTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
