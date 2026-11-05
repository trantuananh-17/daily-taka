import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DashboardPanelProps = {
  title: string
  description?: string
  badge?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function DashboardPanel({
  title,
  description,
  badge,
  action,
  children,
  className,
}: DashboardPanelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-heading text-base font-semibold">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {badge || action ? (
          <CardAction className="flex flex-wrap items-center justify-end gap-2">
            {badge ? <Badge variant="secondary">{badge}</Badge> : null}
            {action}
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
