"use client"

import Link from "next/link"
import {
  Bell,
  ChevronDown,
  Compass,
  LogIn,
  Menu,
  Settings,
  Trophy,
} from "lucide-react"

import { BrandLogo } from "@/components/layout/brand-logo"
import { PAGE_HEADER_INNER, PAGE_TOP_BAR } from "@/components/layout/marketing-page-shell"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const EXPLORE_LINKS = [
  { label: "Nghe chép chính tả", href: "/learn/en/dictation" },
  { label: "Học từ vựng", href: "/learn/en/vocabulary" },
  { label: "Học viết", href: "/learn/en/writing" },
]

type SiteHeaderProps = {
  /** `hero`: nền trong suốt, dùng chung gradient với landing */
  tone?: "default" | "hero"
}

export function SiteHeader({ tone = "default" }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-30",
        PAGE_TOP_BAR,
        tone === "default" && "bg-[var(--dlx-canvas)]/95 backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          PAGE_HEADER_INNER,
          "flex h-[72px] items-center justify-between gap-4",
        )}
      >
          <Link
            href="/"
            className="min-w-0 shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-[var(--dlx-primary)]/40"
          >
            <BrandLogo size="sm" />
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Chính">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-[38px] gap-1.5 rounded-2xl border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] px-4 text-[15px] font-normal text-[var(--dlx-link)] hover:bg-[#D0E9D8] hover:text-[#1F5D3B]",
              )}
            >
              <Compass className="size-4" />
              Khám phá
              <ChevronDown className="size-3.5 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-52">
              {EXPLORE_LINKS.map((item) => (
                <DropdownMenuItem key={item.href} nativeButton={false} render={<Link href={item.href} />}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/leaderboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-[38px] gap-1.5 rounded-[9px] border-[#E8D4A5] bg-[var(--dlx-accent-5)] text-[11px] font-bold text-[var(--dlx-accent-4)] hover:brightness-[0.96]",
            )}
          >
            <Trophy className="size-4 text-[var(--dlx-accent-2)]" />
            Bảng xếp hạng
          </Link>
        </nav>

          <Button
            variant="ghost"
            className="relative size-10 rounded-[9px] text-[var(--dlx-ink)] hover:bg-[var(--dlx-neutral-1)]"
            aria-label="Thông báo"
          >
            <Bell className="size-5" />
            <Badge className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] rounded-full border-2 border-[#fffdfaf] bg-[#D93F35] px-1 text-[10px] font-extrabold text-white shadow-[rgba(107,23,23,0.2)_0px_2px_5px]">
              1
            </Badge>
          </Button>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "default" }),
              "dlx-btn-primary hidden h-[38px] rounded-[9px] px-3 text-[11px] font-bold sm:inline-flex",
            )}
          >
            Đăng nhập
            <LogIn className="size-3.5" />
          </Link>
          <Button
            variant="ghost"
            className="size-10 rounded-[9px] text-[var(--dlx-ink)] hover:bg-[var(--dlx-neutral-1)]"
            aria-label="Cài đặt"
          >
            <Settings className="size-5" />
          </Button>
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-10 rounded-[9px] border-[var(--dlx-hairline)] lg:hidden",
              )}
              aria-label="Mở menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,320px)]">
              <SheetHeader>
                <SheetTitle className="font-heading">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {EXPLORE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[9px] border border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] px-4 py-3 text-[var(--dlx-link)]"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/leaderboard"
                  className="rounded-[9px] border border-[#E8D4A5] bg-[var(--dlx-accent-5)] px-4 py-3 text-[11px] font-bold text-[var(--dlx-accent-4)]"
                >
                  Bảng xếp hạng
                </Link>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "default" }), "dlx-btn-primary mt-2 h-[38px] text-[11px] font-bold")}
                >
                  Đăng nhập
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          </div>
      </div>
    </header>
  )
}
