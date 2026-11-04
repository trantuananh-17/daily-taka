import { SiteHeader } from "@/components/layout/site-header"
import { APP_NAME } from "@/lib/brand"

export const PAGE_CONTAINER = "mx-auto w-full max-w-[1120px] px-4 md:px-6"

/** Wider marketing blocks (e.g. listen topic catalog) */
export const PAGE_CONTAINER_WIDE = "mx-auto w-full max-w-[1280px] px-4 md:px-6"

/** Full-width top bars — same surface as page gradient, not sticky */
export const PAGE_TOP_BAR =
  "w-full border-b border-[var(--dlx-hairline)] bg-transparent"

/** Header / sub-nav inner — full bleed, no max-width cap */
export const PAGE_HEADER_INNER = "w-full px-4 md:px-6 lg:px-8 xl:px-10"

/** Vertical padding for main marketing content (48px on large screens) */
export const PAGE_CONTENT_PY = "py-8 md:py-10 lg:py-12"

type MarketingPageShellProps = {
  children: React.ReactNode
}

export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="dlx-hero-gradient flex min-h-full flex-col">
      <SiteHeader tone="hero" />
      {children}
      <footer className="border-t border-[var(--dlx-hairline)] py-6 text-center">
        <p className="font-body text-[11px] text-[rgb(160,160,152)]">© {APP_NAME}</p>
      </footer>
    </div>
  )
}
