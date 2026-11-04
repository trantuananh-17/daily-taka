import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { HandbookArticlePage } from "@/features/handbook/handbook-article-page"
import { HandbookCatalogPage } from "@/features/handbook/handbook-catalog-page"
import { APP_NAME } from "@/lib/brand"
import {
  getHandbookCollection,
  getHandbookPost,
  listHandbookPostSlugs,
} from "@/lib/learn/handbook/load-handbook-content"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

export function createHandbookCatalogMetadata(language: LanguageHubCode): Metadata {
  const hub = LANGUAGE_HUBS[language]
  const collection = getHandbookCollection(language)
  const title = collection?.title ?? "Cẩm nang"
  return {
    title: `${title} | ${hub.pageTitle} | ${APP_NAME}`,
    description: collection?.description ?? `Cẩm nang học — ${hub.breadcrumbLabel}.`,
  }
}

export function createHandbookCatalogPage(language: LanguageHubCode) {
  return function HandbookCatalogRoute() {
    const collection = getHandbookCollection(language)
    if (!collection) notFound()
    return <HandbookCatalogPage language={language} collection={collection} />
  }
}

export function createHandbookArticleMetadata(
  language: LanguageHubCode,
  postSlug: string,
): Metadata {
  const hub = LANGUAGE_HUBS[language]
  const post = getHandbookPost(language, postSlug)
  if (!post) {
    return { title: `Cẩm nang | ${hub.pageTitle} | ${APP_NAME}` }
  }
  return {
    title: `${post.title} | Cẩm nang | ${APP_NAME}`,
    description: post.summary || post.excerpt,
  }
}

type HandbookArticlePageParams = {
  params: Promise<{ postSlug: string }>
}

export function createHandbookArticlePage(language: LanguageHubCode) {
  return async function HandbookArticleRoute({ params }: HandbookArticlePageParams) {
    const { postSlug } = await params
    const post = getHandbookPost(language, postSlug)
    if (!post) notFound()
    return <HandbookArticlePage language={language} post={post} />
  }
}

export function createHandbookArticleStaticParams(language: LanguageHubCode) {
  return listHandbookPostSlugs(language).map((postSlug) => ({ postSlug }))
}
