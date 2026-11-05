import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  FileText,
  Headphones,
  LayoutDashboard,
  MessageSquareWarning,
  PenLine,
  ScrollText,
  Settings,
  Languages,
  Tags,
} from "lucide-react"

export type AdminNavItem = {
  title: string
  href: string
  icon: LucideIcon
  description?: string
}

export type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        description: "Thống kê và tóm tắt hệ thống",
      },
    ],
  },
  {
    label: "Nội dung học",
    items: [
      {
        title: "Topic",
        href: "/topics",
        icon: Tags,
        description: "Chủ đề dùng chung (Listen, Vocab, …)",
      },
      { title: "Listen", href: "/listen", icon: Headphones, description: "Section, bài nghe theo topic" },
      { title: "Từ vựng", href: "/vocab", icon: Languages, description: "Level, topic, lesson, từ" },
      { title: "Luyện viết", href: "/writing", icon: PenLine, description: "Prompt và câu mẫu" },
      {
        title: "Kiến thức",
        href: "/knowledge",
        icon: FileText,
        description: "Nội dung Kiến thức trên hub — riêng Cẩm nang, không gộp blog/bài viết",
      },
      {
        title: "Cẩm nang",
        href: "/handbook",
        icon: BookOpen,
        description: "Collection & mục cẩm nang (handbook)",
      },
    ],
  },
  {
    label: "Vận hành",
    items: [
      { title: "System logs", href: "/logs", icon: ScrollText, description: "Theo dõi log hệ thống" },
      { title: "Report / Ticket", href: "/reports", icon: MessageSquareWarning, description: "Phản hồi từ người học" },
    ],
  },
  {
    label: "Cấu hình",
    items: [
      { title: "Settings", href: "/settings", icon: Settings, description: "Admin & hệ thống" },
    ],
  },
]

export function findAdminNavTitle(pathname: string): string {
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) {
        return item.title
      }
    }
  }
  return "Admin"
}
