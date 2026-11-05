import { Suspense } from "react"

import { AdminLoginForm } from "@/components/auth/admin-login-form"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[var(--dlx-canvas)]" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
