import { MOCK_ADMIN_DASHBOARD_SUMMARY } from "@/lib/admin-dashboard/mock-summary"
import type { AdminDashboardSummary } from "@/lib/admin-dashboard/types"

/**
 * Server loader for dashboard home.
 * **Default: mock** (typed with BE contract). Do not call Hono until user requests — use
 * `fetchAdminDashboardSummaryFromApi()` then.
 * @see docs/design/2026-11-05-admin-dashboard-data.md
 */
export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  return MOCK_ADMIN_DASHBOARD_SUMMARY
}
