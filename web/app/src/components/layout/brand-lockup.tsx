import { BrandMark } from "@/components/layout/brand-mark"
import { APP_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

type BrandLockupProps = {
  className?: string
  /** Icon scale beside the wordmark stack */
  markSize?: "md" | "lg" | "hero"
  as?: "div" | "span"
  /** Hero: 50px title + tagline; header: 22px single line (prefer BrandLogo in nav) */
  variant?: "hero" | "compact"
}

export function BrandLockup({
  className,
  markSize = "hero",
  as: Tag = "div",
  variant = "hero",
}: BrandLockupProps) {
  if (variant === "compact") {
    return (
      <Tag className={cn("flex min-w-0 items-center gap-2.5", className)}>
        <BrandMark size="sm" className="shrink-0" />
        <span className="dlx-brand-header-wordmark">{APP_NAME}</span>
      </Tag>
    )
  }

  return (
    <Tag className={cn("flex min-w-0 items-center gap-4 md:gap-5", className)}>
      <BrandMark size={markSize} className="shrink-0" />
      <span className="flex min-w-0 flex-col items-start gap-1 text-left">
        <span className="dlx-brand-title">{APP_NAME}</span>
        <span className="dlx-brand-tagline">Nghe · Học · Tiến bộ</span>
      </span>
    </Tag>
  )
}
