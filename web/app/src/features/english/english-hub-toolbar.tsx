import Link from "next/link"
import { BookOpen, ChevronRight, Compass, GraduationCap, Library, MapPin } from "lucide-react"

import { PAGE_HEADER_INNER, PAGE_TOP_BAR } from "@/components/layout/marketing-page-shell"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

import "./learning-topbar.css"

type EnglishHubToolbarProps = {
  language: LanguageHubCode
}

export function EnglishHubToolbar({ language }: EnglishHubToolbarProps) {
  const hub = LANGUAGE_HUBS[language]
  return (
    <div className={PAGE_TOP_BAR}>
      <div className={PAGE_HEADER_INNER}>
        <header className="writing-topbar">
          <nav className="breadcrumbs learning-breadcrumbs" aria-label="Điều hướng">
            <ol role="list">
              <li>
                <Link className="breadcrumb-link" href="/">
                  <GraduationCap width={17} height={17} strokeWidth={2} aria-hidden />
                  <span className="breadcrumb-label">{APP_NAME}</span>
                </Link>
              </li>
              <li>
                <ChevronRight
                  width={15}
                  height={15}
                  strokeWidth={2}
                  className="breadcrumb-separator"
                  aria-hidden
                />
                <span className="breadcrumb-current" aria-current="page">
                  <MapPin width={14} height={14} strokeWidth={2} aria-hidden />
                  <span className="breadcrumb-label">{hub.breadcrumbLabel}</span>
                </span>
              </li>
            </ol>
          </nav>

          <div className="content-header-action">
            <div className="learning-resource-nav">
              <Link
                className="knowledge-nav-button learning-path-nav"
                href={hub.learningPathHref}
                aria-label="Lộ trình học"
                title="Lộ trình học"
              >
                <Compass width={17} height={17} strokeWidth={2} aria-hidden />
                <span>Lộ trình học</span>
              </Link>
              <button type="button" className="knowledge-nav-button" aria-label="Kiến thức">
                <BookOpen width={17} height={17} strokeWidth={2} aria-hidden />
                <span>Kiến thức</span>
              </button>
              <button
                type="button"
                className="knowledge-nav-button guide-nav-button"
                aria-label="Cẩm nang"
              >
                <Library width={17} height={17} strokeWidth={2} aria-hidden />
                <span>Cẩm nang</span>
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  )
}
