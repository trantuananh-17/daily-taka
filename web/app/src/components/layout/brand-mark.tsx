import { cn } from "@/lib/utils"

type BrandMarkProps = {
  className?: string
  size?: "sm" | "md" | "lg" | "hero"
}

const boxClass = {
  sm: "size-8 rounded-lg",
  md: "size-10 rounded-xl",
  lg: "size-14 rounded-2xl",
  hero: "size-[88px] rounded-[22px] md:size-[104px]",
}

export function BrandMark({ className, size = "md" }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center border border-[var(--dlx-hairline)] bg-[#fffdfaf] shadow-[0_8px_28px_rgba(23,32,25,0.06)]",
        boxClass[size],
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 48 48" className="size-[62%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 8h22c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4H10V8z"
          fill="#E8F5EE"
          stroke="#2E7D5B"
          strokeWidth="1.5"
        />
        <path d="M14 12v24" stroke="#2E7D5B" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M18 14h12c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H18V14z"
          fill="url(#taka-l-gradient)"
        />
        <path
          d="M28 32c3 0 5.5-2.5 5.5-5.5S31 21 28 21"
          stroke="#DF7059"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="taka-l-gradient" x1="18" y1="14" x2="32" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2E7D5B" />
            <stop offset="1" stopColor="#D3A349" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  )
}
