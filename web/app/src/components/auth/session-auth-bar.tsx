"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/client"

export function SessionAuthBar() {
  const { data: session, isPending } = authClient.useSession()
  const [email, setEmail] = useState("learner@dailytaka.local")
  const [password, setPassword] = useState("dailytaka-dev-pass")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (process.env.NODE_ENV === "production") return null

  async function handleSignUp() {
    setBusy(true)
    setMessage(null)
    try {
      await authClient.signUp.email({ email, password, name: "Learner" })
      setMessage("Đã tạo tài khoản / đăng nhập.")
    } catch {
      setMessage("Sign up thất bại — thử Đăng nhập nếu email đã tồn tại.")
    } finally {
      setBusy(false)
    }
  }

  async function handleSignIn() {
    setBusy(true)
    setMessage(null)
    try {
      await authClient.signIn.email({ email, password })
      setMessage("Đã đăng nhập.")
    } catch {
      setMessage("Đăng nhập thất bại.")
    } finally {
      setBusy(false)
    }
  }

  async function handleSignOut() {
    await authClient.signOut()
    setMessage(null)
  }

  if (isPending) return null

  if (session?.user) {
    return (
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-4 py-2 font-body text-xs text-muted-foreground">
        <span>
          Session: <strong className="text-foreground">{session.user.email}</strong>
        </span>
        <Button type="button" size="sm" variant="outline" onClick={() => void handleSignOut()}>
          Đăng xuất
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-4 py-2 font-body text-xs">
      <input
        className="h-8 rounded-md border border-input bg-background px-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email dev"
      />
      <input
        className="h-8 rounded-md border border-input bg-background px-2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password dev"
      />
      <Button type="button" size="sm" disabled={busy} onClick={() => void handleSignUp()}>
        Dev sign up
      </Button>
      <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => void handleSignIn()}>
        Đăng nhập
      </Button>
      {message ? <span className="text-muted-foreground">{message}</span> : null}
    </div>
  )
}
