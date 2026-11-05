import type { AdminDashboardAttentionItem } from "@/lib/admin-dashboard/types"

export const ATTENTION_KIND_LABEL: Record<AdminDashboardAttentionItem["kind"], string> = {
  draft: "Draft",
  missing_audio: "Audio",
  ticket: "Ticket",
  api_error: "API",
}

export function attentionKindVariant(
  kind: AdminDashboardAttentionItem["kind"],
): "default" | "secondary" | "destructive" | "outline" {
  switch (kind) {
    case "api_error":
      return "destructive"
    case "ticket":
      return "default"
    case "missing_audio":
      return "outline"
    default:
      return "secondary"
  }
}
