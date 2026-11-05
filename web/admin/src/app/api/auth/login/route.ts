import { NextResponse } from "next/server"

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants"
import { adminSessionCookieOptions } from "@/lib/auth/session"

export async function POST(request: Request) {
  const expected = process.env.ADMIN_API_KEY
  if (!expected || expected.length < 8) {
    return NextResponse.json({ error: "ADMIN_API_KEY chưa cấu hình trên server" }, { status: 503 })
  }

  let body: { apiKey?: string }
  try {
    body = (await request.json()) as { apiKey?: string }
  } catch {
    return NextResponse.json({ error: "Body JSON không hợp lệ" }, { status: 400 })
  }

  if (!body.apiKey || body.apiKey !== expected) {
    return NextResponse.json({ error: "API key không đúng" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, "1", adminSessionCookieOptions())
  return res
}
