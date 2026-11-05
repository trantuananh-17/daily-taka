import { NextResponse, type NextRequest } from "next/server"

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants"

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout"] as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }

  if (request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "1") {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("from", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
