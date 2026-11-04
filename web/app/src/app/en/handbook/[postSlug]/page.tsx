import {
  createHandbookArticleMetadata,
  createHandbookArticlePage,
  createHandbookArticleStaticParams,
} from "@/features/handbook/create-handbook-page"

type PageProps = {
  params: Promise<{ postSlug: string }>
}

export function generateStaticParams() {
  return createHandbookArticleStaticParams("en")
}

export async function generateMetadata({ params }: PageProps) {
  const { postSlug } = await params
  return createHandbookArticleMetadata("en", postSlug)
}

export default createHandbookArticlePage("en")
