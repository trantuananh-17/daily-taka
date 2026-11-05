"use client"

import * as React from "react"

import { AdminBrand } from "@/components/admin-brand"
import { AdminNavFooter } from "@/components/admin-nav-footer"
import { NavAdminGroups } from "@/components/nav-admin-groups"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

/** shadcn sidebar-07 shell — `variant` default (full width, square content). */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavAdminGroups />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
