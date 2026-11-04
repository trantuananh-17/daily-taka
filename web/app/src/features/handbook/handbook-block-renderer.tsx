import { HandbookInlineText } from "@/features/handbook/handbook-inline-text"
import type { HandbookBlock } from "@/lib/learn/handbook/types/content"

function HandbookTextBlock({ block }: { block: Extract<HandbookBlock, { kind: "text" }> }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-bold leading-snug text-[var(--dlx-ink)] sm:text-2xl">
        {block.heading}
      </h2>
      {block.paragraphs.map((paragraph, index) => (
        <p key={index} className="font-body text-base leading-relaxed text-[var(--dlx-ink)] sm:text-[17px]">
          <HandbookInlineText text={paragraph} />
        </p>
      ))}
    </section>
  )
}

function HandbookNumberedListBlock({
  block,
}: {
  block: Extract<HandbookBlock, { kind: "numberedList" }>
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-bold leading-snug text-[var(--dlx-ink)] sm:text-2xl">
        {block.heading}
      </h2>
      {block.intro ? (
        <p className="font-body text-base leading-relaxed text-[var(--dlx-ink)] sm:text-[17px]">
          {block.intro}
        </p>
      ) : null}
      <ol className="flex list-none flex-col gap-3 pl-0">
        {block.items.map((item, index) => (
          <li key={index} className="flex gap-3 font-body text-base leading-relaxed text-[var(--dlx-ink)] sm:text-[17px]">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-heading text-xs font-bold text-emerald-800"
              aria-hidden
            >
              {index + 1}
            </span>
            <span className="min-w-0 pt-0.5">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function HandbookBlockRenderer({ blocks }: { blocks: HandbookBlock[] }) {
  if (!blocks.length) {
    return (
      <p className="font-body text-base text-[var(--dlx-muted)]">
        Nội dung chi tiết đang được cập nhật.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {blocks.map((block, index) => {
        if (block.kind === "text") {
          return <HandbookTextBlock key={index} block={block} />
        }
        return <HandbookNumberedListBlock key={index} block={block} />
      })}
    </div>
  )
}
