import { AdminDashboardShell } from "@/components/layout/admin-dashboard-shell"

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>
}
