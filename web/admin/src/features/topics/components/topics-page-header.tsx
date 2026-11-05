import { Badge } from "@/components/ui/badge"

export function TopicsPageHeader() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="font-heading text-xl font-bold tracking-tight">Topic</h2>
      <Badge variant="outline">Dùng chung · Mock</Badge>
    </div>
  )
}
