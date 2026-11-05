"use client"

import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AdminNavFooter() {
  const router = useRouter()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Đăng xuất"
          onClick={() => {
            void (async () => {
              await fetch("/api/auth/logout", { method: "POST" })
              router.push("/login")
              router.refresh()
            })()
          }}
        >
          <LogOutIcon aria-hidden />
          <span>Đăng xuất</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
