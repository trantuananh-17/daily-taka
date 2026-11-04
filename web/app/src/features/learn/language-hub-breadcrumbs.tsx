"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, GraduationCap, MapPin } from "lucide-react"
import { cn } from "cn"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type HubBreadcrumbItem = {
  label: string
  href?: string
}

const crumbPill = cn(
  "inline-flex max-w-[9.5rem] shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 font-heading text-[11px] font-bold leading-none sm:max-w-none sm:gap-1.5 sm:px-3 sm:text-[13px]",
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
        <span className="truncate">{item.label}</span>
      </Link>
    )
  }

  return (
    <span
      className={cn(
        crumbPill,
        "max-w-[10.5rem] border-[#b8d9c8] bg-[#d0e9d8] text-[var(--dlx-link)] sm:max-w-[16rem]",
      )}
      aria-current={isCurrent ? "page" : undefined}
      title={item.label}
    >
      <Icon className={cn("shrink-0", iconClass)} strokeWidth={2} aria-hidden />
      <span className="truncate">{item.label}</span>
    </span>
  )
}

function MiddleCrumbMenu({ items }: { items: HubBreadcrumbItem[] }) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          crumbPill,
          "cursor-pointer border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] text-[var(--dlx-link)] outline-none hover:bg-[#d0e9d8] data-popup-open:bg-[#d0e9d8]",
        )}
        aria-label="Chọn mục điều hướng"
      >
        <MapPin className="size-3.5 shrink-0 sm:size-3.5" strokeWidth={2} aria-hidden />
        <span>…</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            disabled={!item.href}
            onClick={() => {
              if (item.href) router.push(item.href)
            }}
            className="cursor-pointer font-body text-sm"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type LanguageHubBreadcrumbsProps = {
  items: HubBreadcrumbItem[]
}

/** Hiển thị tối đa 4 tag; nếu dài hơn thì tag thứ 3 là menu “…”. */
export function LanguageHubBreadcrumbs({ items }: LanguageHubBreadcrumbsProps) {
  const collapsed = items.length > 4
  const head = collapsed ? items.slice(0, 2) : []
  const middle = collapsed ? items.slice(2, -1) : []
  const tail = collapsed ? items[items.length - 1]! : null

  const listClass = cn(
    "m-0 flex list-none items-center gap-1.5 p-0 sm:gap-2",
    collapsed ? "flex-wrap sm:flex-nowrap" : "flex-nowrap overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden",
  )

  return (
    <ol className={listClass} role="list">
      {!collapsed
        ? items.map((item, index) => {
            const isLast = index === items.length - 1
            const isFirst = index === 0
            return (
              <li key={`${item.label}-${index}`} className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2">
                {index > 0 ? <CrumbSeparator /> : null}
                <CrumbNode item={item} isFirst={isFirst} isCurrent={isLast} />
              </li>
            )
          })
        : null}

      {collapsed ? (
        <>
          {head.map((item, index) => (
            <li key={`head-${item.label}-${index}`} className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2">
              {index > 0 ? <CrumbSeparator /> : null}
              <CrumbNode item={item} isFirst={index === 0} isCurrent={false} />
            </li>
          ))}
          <li className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2">
            <CrumbSeparator />
            <MiddleCrumbMenu items={middle} />
          </li>
          <li className="inline-flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
            <CrumbSeparator />
            <CrumbNode item={tail} isFirst={false} isCurrent />
          </li>
        </>
      ) : null}
    </ol>
  )
}
