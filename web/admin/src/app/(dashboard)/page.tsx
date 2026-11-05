import { AdminDashboardView } from "@/features/dashboard/admin-dashboard-view"
import { getAdminDashboardSummary } from "@/lib/admin-dashboard/get-admin-dashboard-summary"

export default async function AdminHomePage() {
  const summary = await getAdminDashboardSummary()
  return <AdminDashboardView summary={summary} />
}
