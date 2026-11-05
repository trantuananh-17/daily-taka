"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { KeyRound, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN_APP_TITLE } from "@/lib/brand"

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? "/"

  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setError(body?.error ?? "Đăng nhập thất bại")
        return
      }
      router.replace(from.startsWith("/") ? from : "/")
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[var(--dlx-canvas)] p-4">
      <Card className="w-full max-w-md border-[var(--dlx-hairline)] shadow-[var(--dlx-shadow-sm)]">
        <CardHeader>
          <CardTitle className="font-heading text-xl">{ADMIN_APP_TITLE}</CardTitle>
          <CardDescription>
            Nhập <strong>ADMIN_API_KEY</strong> (server) — không lưu trên client, chỉ cookie phiên 12h.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="admin-api-key" className="text-sm font-medium text-[var(--dlx-ink)]">
                Admin API key
              </label>
              <div className="relative">
                <KeyRound
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  id="admin-api-key"
                  name="apiKey"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
