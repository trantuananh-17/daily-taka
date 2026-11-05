"use client"

import Link from "next/link"
import { ChevronRight, GraduationCap, MapPin } from "lucide-react"
import { cn } from "cn"

export type HubBreadcrumbItem = {
  label: string
  href?: string
}

const crumbPill = cn(
  "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1.5 font-heading text-[11px] font-bold leading-none sm:gap-1.5 sm:px-3 sm:text-[13px]",
)

function CrumbSeparator() {
  return (
    <ChevronRight
      width={14}
      height={14}
      strokeWidth={2}
      className="shrink-0 text-[var(--dlx-muted)] sm:h-[15px] sm:w-[15px]"
      aria-hidden
    />
  )
}

function CrumbNode({
  item,
  isFirst,
  isCurrent,
}: {
  item: HubBreadcrumbItem
  isFirst: boolean
  isCurrent: boolean
}) {
  const iconClass = isFirst ? "size-4 sm:size-[17px]" : "size-3.5 sm:size-3.5"
  const Icon = isFirst ? GraduationCap : MapPin

  if (item.href && !isCurrent) {
    return (
      <Link
        href={item.href}
        className={cn(
          crumbPill,
          "border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] text-[var(--dlx-link)] no-underline transition-colors hover:bg-[#d0e9d8]",
        )}
      >
        <Icon className={cn("shrink-0", iconClass)} strokeWidth={2} aria-hidden />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <span
      className={cn(crumbPill, "border-[#b8d9c8] bg-[#d0e9d8] text-[var(--dlx-link)]")}
      aria-current={isCurrent ? "page" : undefined}
    >
      <Icon className={cn("shrink-0", iconClass)} strokeWidth={2} aria-hidden />
      <span>{item.label}</span>
    </span>
  )
}

type LanguageHubBreadcrumbsProps = {
  items: HubBreadcrumbItem[]
}

export function LanguageHubBreadcrumbs({ items }: LanguageHubBreadcrumbsProps) {
  return (
    <ol
      className={cn(
        "m-0 flex w-full min-w-0 list-none flex-nowrap items-center gap-1.5 overflow-x-auto p-0 pb-0.5 sm:gap-2",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      )}
      role="list"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const isFirst = index === 0
        return (
          <li key={`${item.label}-${index}`} className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2">
            {index > 0 ? <CrumbSeparator /> : null}
            <CrumbNode item={item} isFirst={isFirst} isCurrent={isLast} />
          </li>
        )
      })}
    </ol>
  )
}
