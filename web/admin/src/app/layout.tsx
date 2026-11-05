import type { Metadata } from "next"
import { DM_Sans, Manrope } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ADMIN_APP_TITLE } from "@/lib/brand"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: ADMIN_APP_TITLE,
  description: "Quản trị nội dung Daily Taka — listen, vocab, writing.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${manrope.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full font-body">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
