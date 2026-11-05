"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ADMIN_APP_TITLE, APP_NAME } from "@/lib/brand"

/** Block sidebar-07 header pattern — icon column aligns in icon-collapsed mode. */
export function AdminBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={<Link href="/" />} tooltip={ADMIN_APP_TITLE}>
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-4" strokeWidth={2} aria-hidden />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{APP_NAME}</span>
            <span className="truncate text-xs text-muted-foreground">Admin CMS</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
