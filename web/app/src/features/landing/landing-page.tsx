import {
  MarketingPageShell,
  PAGE_CONTAINER,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { LandingHero } from "@/features/landing/landing-hero"
import { LanguageGrid } from "@/features/landing/language-grid"
import { cn } from "@/lib/utils"

export function LandingPage() {
  return (
    <MarketingPageShell>
      <main className={PAGE_CONTAINER}>
        <div className={cn("flex flex-1 flex-col gap-12 md:gap-16", PAGE_CONTENT_PY)}>
          <LandingHero />
          <LanguageGrid />
        </div>
      </main>
    </MarketingPageShell>
  )
}
