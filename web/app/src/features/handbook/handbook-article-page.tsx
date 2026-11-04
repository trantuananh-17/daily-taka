import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { HandbookArticleHeader } from "@/features/handbook/handbook-article-header"
import { HandbookBlockRenderer } from "@/features/handbook/handbook-block-renderer"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import type { HandbookPost } from "@/lib/learn/handbook/types/content"
import type { LanguageHubCode } from "@/lib/learn/hub"

type HandbookArticlePageProps = {
  language: LanguageHubCode
  post: HandbookPost
}

export function HandbookArticlePage({ language, post }: HandbookArticlePageProps) {
  return (
    <MarketingPageShell>
      <LanguageHubToolbar
        language={language}
        trail={[
          { label: "Cẩm nang", href: `/${language}/handbook` },
          { label: post.title },
        ]}
      />
      <div className={PAGE_CONTAINER_WIDE}>
        <article className={`${PAGE_CONTENT_PY} mx-auto max-w-3xl`}>
          <HandbookArticleHeader post={post} />
          <div className="mt-8 md:mt-10">
            <HandbookBlockRenderer blocks={post.blocks} />
          </div>
        </article>
      </div>
    </MarketingPageShell>
  )
}
