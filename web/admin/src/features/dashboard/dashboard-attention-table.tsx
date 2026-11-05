import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ATTENTION_KIND_LABEL, attentionKindVariant } from "@/lib/admin-dashboard/attention-meta"
import type { AdminDashboardAttentionItem } from "@/lib/admin-dashboard/types"
import { cn } from "cn"

type DashboardAttentionTableProps = {
  items: AdminDashboardAttentionItem[]
}

export function DashboardAttentionTable({ items }: DashboardAttentionTableProps) {
  return (
    <DashboardPanel title="Cần chú ý">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Loại</TableHead>
            <TableHead scope="col">Lang</TableHead>
            <TableHead scope="col">Mô tả</TableHead>
            <TableHead scope="col" className="w-[5rem] text-right">
              <span className="sr-only">Hành động</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Badge variant={attentionKindVariant(item.kind)}>{ATTENTION_KIND_LABEL[item.kind]}</Badge>
              </TableCell>
              <TableCell>
                {item.language ? (
                  <Badge variant="outline" className="uppercase">
                    {item.language}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">App</span>
                )}
              </TableCell>
              <TableCell className="max-w-md truncate" title={item.title}>
                {item.title}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={item.href}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "no-underline")}
                >
                  Mở
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardPanel>
  )
}
