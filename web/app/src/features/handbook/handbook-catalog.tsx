import { HandbookCollectionHeader } from "@/features/handbook/handbook-collection-header"
import { HandbookPostCard } from "@/features/handbook/handbook-post-card"
import type { HandbookCollection } from "@/lib/learn/handbook/types/content"
import type { LanguageHubCode } from "@/lib/learn/hub"

type HandbookCatalogProps = {
  language: LanguageHubCode
  collection: HandbookCollection
}

export function HandbookCatalog({ language, collection }: HandbookCatalogProps) {
  const sorted = [...collection.posts].sort((a, b) => a.sortOrder - b.sortOrder)
  const featured = sorted.find((p) => p.featured) ?? sorted[0]
  const rest = sorted.filter((p) => p.slug !== featured?.slug)

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <HandbookCollectionHeader collection={collection} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {featured ? (
          <div className="md:col-span-full">
            <HandbookPostCard language={language} post={featured} featured />
          </div>
        ) : null}
        {rest.map((post) => (
          <HandbookPostCard key={post.slug} language={language} post={post} />
        ))}
      </div>
    </div>
  )
}
