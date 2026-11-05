import { adminDashboardSummarySchema } from "@/lib/admin-dashboard/types"
import type { AdminDashboardSummary } from "@/lib/admin-dashboard/types"

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080"
}

/**
 * Real API loader — **not wired** by default.
 * Enable in `get-admin-dashboard-summary.ts` only when user explicitly asks to connect API.
 * @see docs/design/2026-11-05-admin-dashboard-data.md
 */
export async function fetchAdminDashboardSummaryFromApi(): Promise<AdminDashboardSummary> {
  const key = process.env.ADMIN_API_KEY?.trim()
  if (!key) {
    throw new Error("ADMIN_API_KEY chưa cấu hình (web/admin/.env.local)")
  }

  const res = await fetch(`${apiBaseUrl()}/v1/admin/dashboard/summary`, {
    headers: { "x-admin-api-key": key },
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Dashboard summary failed (${res.status}): ${body || res.statusText}`)
  }

  const json: unknown = await res.json()
  return adminDashboardSummarySchema.parse(json)
}
