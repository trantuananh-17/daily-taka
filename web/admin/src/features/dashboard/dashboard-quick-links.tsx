import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { HeadphonesIcon, LanguagesIcon, PenLineIcon, TagsIcon, TicketIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import { cn } from "cn"

type QuickLink = {
  href: string
  label: string
  icon: LucideIcon
}

const QUICK_LINKS: QuickLink[] = [
  { href: "/topics", label: "Topic", icon: TagsIcon },
  { href: "/listen", label: "Listen CMS", icon: HeadphonesIcon },
  { href: "/vocab", label: "Vocab (EN)", icon: LanguagesIcon },
  { href: "/writing", label: "Writing (EN)", icon: PenLineIcon },
  { href: "/reports", label: "Reports & tickets", icon: TicketIcon },
]

export function DashboardQuickLinks() {
  return (
    <DashboardPanel title="Truy cập nhanh">
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 w-full justify-start gap-2 no-underline",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  )
}
