import { BrandMark } from "@/components/layout/brand-mark"
import { APP_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  size?: "sm" | "md" | "lg"
  showWordmark?: boolean
}

const titleClass = {
  sm: "dlx-brand-header-wordmark",
  md: "dlx-brand-header-wordmark",
  lg: "text-2xl font-heading font-extrabold tracking-tight text-[var(--dlx-ink)]",
}

export function BrandLogo({ className, size = "md", showWordmark = true }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <BrandMark size={size === "lg" ? "md" : "sm"} />
      {showWordmark ? <span className={titleClass[size]}>{APP_NAME}</span> : null}
    </div>
  )
}
