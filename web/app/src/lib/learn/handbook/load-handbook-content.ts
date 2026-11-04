import postsDocument from "@/lib/learn/handbook/mock/handbook-posts-en.sample.json"
import type {
  HandbookCollection,
  HandbookLanguage,
  HandbookPost,
  HandbookPostsDocument,
} from "@/lib/learn/handbook/types/content"
import type { LanguageHubCode } from "@/lib/learn/hub"

const document = postsDocument as HandbookPostsDocument

const HUB_TO_HANDBOOK_LANG: Record<LanguageHubCode, HandbookLanguage> = {
  en: "en",
  zh: "zh",
  jp: "jp",
}

export function getHandbookCollection(
  language: LanguageHubCode,
  collectionSlug = "handbook",
): HandbookCollection | null {
  const handbookLang = HUB_TO_HANDBOOK_LANG[language]
  return (
    document.collections.find(
      (c) => c.language === handbookLang && c.slug === collectionSlug,
    ) ?? null
  )
}

export function getHandbookPost(
  language: LanguageHubCode,
  postSlug: string,
  collectionSlug = "handbook",
): HandbookPost | null {
  const collection = getHandbookCollection(language, collectionSlug)
  if (!collection) return null
  return collection.posts.find((p) => p.slug === postSlug) ?? null
}

export function listHandbookPostSlugs(language: LanguageHubCode, collectionSlug = "handbook"): string[] {
  const collection = getHandbookCollection(language, collectionSlug)
  return collection?.posts.map((p) => p.slug) ?? []
}
