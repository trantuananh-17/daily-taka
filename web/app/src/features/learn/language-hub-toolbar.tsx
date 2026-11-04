import Link from "next/link"
import { BookOpen, Compass, Library } from "lucide-react"
import { cn } from "cn"

import { PAGE_HEADER_INNER, PAGE_TOP_BAR } from "@/components/layout/marketing-page-shell"
import { LanguageHubBreadcrumbs, type HubBreadcrumbItem } from "@/features/learn/language-hub-breadcrumbs"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

type LanguageHubToolbarProps = {
  language: LanguageHubCode
  trail?: HubBreadcrumbItem[]
}

function buildBreadcrumbs(language: LanguageHubCode, trail?: HubBreadcrumbItem[]): HubBreadcrumbItem[] {
  const hub = LANGUAGE_HUBS[language]
  const items: HubBreadcrumbItem[] = [{ label: APP_NAME, href: "/" }]
  if (trail?.length) {
    items.push({ label: hub.breadcrumbLabel, href: `/${language}` })
    items.push(...trail)
  } else {
    items.push({ label: hub.breadcrumbLabel })
  }
  return items
}

const crumbPill = cn(
  "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 font-heading text-[11px] font-bold leading-none",
  "sm:gap-1.5 sm:px-3 sm:text-[13px]",
)

const utilityPill = cn(
  crumbPill,
  "cursor-pointer border-[#b8d9c8] bg-[var(--dlx-neutral-1)] text-[var(--dlx-link)] transition-colors hover:bg-[#d0e9d8]",
)

function HubToolbarActions({ language }: { language: LanguageHubCode }) {
  const hub = LANGUAGE_HUBS[language]
  return (
    <div
      className="flex w-full shrink-0 items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:w-auto sm:justify-end sm:gap-2 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
      aria-label="Công cụ học"
    >
      <Link
        href={hub.learningPathHref}
        aria-label="Lộ trình học"
        title="Lộ trình học"
        className={cn(utilityPill, "no-underline")}
      >
        <Compass className="size-4 shrink-0 sm:size-[17px]" strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Lộ trình học</span>
      </Link>
      <button type="button" aria-label="Kiến thức" title="Kiến thức" className={utilityPill}>
        <BookOpen className="size-4 shrink-0 sm:size-[17px]" strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Kiến thức</span>
      </button>
      <button type="button" aria-label="Cẩm nang" title="Cẩm nang" className={utilityPill}>
        <Library className="size-4 shrink-0 sm:size-[17px]" strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Cẩm nang</span>
      </button>
    </div>
  )
}

export function LanguageHubToolbar({ language, trail }: LanguageHubToolbarProps) {
  const breadcrumbs = buildBreadcrumbs(language, trail)

  return (
    <div className={PAGE_TOP_BAR}>
      <div className={PAGE_HEADER_INNER}>
        <header className="flex flex-col gap-2.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <nav aria-label="Điều hướng" className="relative min-w-0 max-w-full flex-1">
            <LanguageHubBreadcrumbs items={breadcrumbs} />
          </nav>

          <HubToolbarActions language={language} />
        </header>
      </div>
    </div>
  )
}
