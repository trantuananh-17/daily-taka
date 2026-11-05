import type { Metadata } from "next"
import { DM_Sans, Manrope } from "next/font/google"

import { SessionAuthBar } from "@/components/auth/session-auth-bar"
import { AuthSessionProvider } from "@/lib/auth/auth-session-provider"
import { QueryProvider } from "@/lib/api/query-provider"
import { APP_NAME } from "@/lib/brand"
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
  title: `${APP_NAME} — Nghe · Học · Tiến bộ`,
  description:
    "Học tiếng Anh, tiếng Nhật và tiếng Trung: nghe chép chính tả, từ vựng theo ngữ cảnh, luyện viết theo trình độ.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${manrope.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body">
        <QueryProvider>
          <AuthSessionProvider>
            <SessionAuthBar />
            {children}
          </AuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
