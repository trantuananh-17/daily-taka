import type { HandbookCollection } from "@/lib/learn/handbook/types/content"

type HandbookCollectionHeaderProps = {
  collection: HandbookCollection
}

export function HandbookCollectionHeader({ collection }: HandbookCollectionHeaderProps) {
  const count = collection.posts.length
  const countLabel = `${count} bài viết`

  return (
    <header className="border-l-4 border-emerald-600 pl-4 sm:pl-5">
      <p className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700 sm:text-xs">
        {collection.overline}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-[var(--dlx-ink)] sm:text-4xl">
        {collection.title}
      </h1>
      <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-[var(--dlx-muted)] sm:text-[17px]">
        {collection.description}
      </p>
      <p className="mt-3 font-body text-sm text-[rgb(160,160,152)]">{countLabel}</p>
    </header>
  )
}
