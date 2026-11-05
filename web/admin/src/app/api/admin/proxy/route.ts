import { NextResponse } from "next/server"

const ALLOWED_PREFIX = "/v1/admin/"

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080"
}

type ProxyBody = {
  method?: string
  path?: string
  body?: unknown
}

export async function POST(request: Request) {
  const key = process.env.ADMIN_API_KEY?.trim()
  if (!key) {
    return NextResponse.json({ error: "ADMIN_API_KEY chưa cấu hình" }, { status: 503 })
  }

  let payload: ProxyBody
  try {
    payload = (await request.json()) as ProxyBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const method = (payload.method ?? "GET").toUpperCase()
  const path = payload.path ?? ""
  if (!path.startsWith(ALLOWED_PREFIX)) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 })
  }

  const url = `${apiBaseUrl()}${path}`
  const init: RequestInit = {
    method,
    headers: {
      "x-admin-api-key": key,
      ...(payload.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  }
  if (payload.body !== undefined && method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(payload.body)
  }

  const upstream = await fetch(url, init)
  const text = await upstream.text()
  if (!upstream.ok) {
    return new NextResponse(text || upstream.statusText, { status: upstream.status })
  }

  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  try {
    return NextResponse.json(JSON.parse(text))
  } catch {
    return new NextResponse(text, { status: upstream.status })
  }
}
