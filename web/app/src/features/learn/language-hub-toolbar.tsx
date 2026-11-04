import Link from "next/link"
import { BookOpen, ChevronRight, Compass, GraduationCap, Library, MapPin } from "lucide-react"

import { PAGE_HEADER_INNER, PAGE_TOP_BAR } from "@/components/layout/marketing-page-shell"
import { APP_NAME } from "@/lib/brand"
import { LANGUAGE_HUBS, type LanguageHubCode } from "@/lib/learn/hub"

import "./learning-topbar.css"

type HubBreadcrumbItem = {
  label: string
  href?: string
}

type LanguageHubToolbarProps = {
  language: LanguageHubCode
  /** Extra crumbs after the language hub (hub becomes a link when set). */
  trail?: HubBreadcrumbItem[]
}

function buildBreadcrumbs(language: LanguageHubCode, trail?: HubBreadcrumbItem[]): HubBreadcrumbItem[] {
  const hub = LANGUAGE_HUBS[language]
  const items: HubBreadcrumbItem[] = [{ label: APP_NAME, href: "/" }]
  if (trail?.length) {
    items.push({ label: hub.breadcrumbLabel, href: `/${language}` })
    items.push(...trail)
  } else {
    items.push({ label: hub.breadcrumbLabel })
  }
  return items
}

export function LanguageHubToolbar({ language, trail }: LanguageHubToolbarProps) {
  const hub = LANGUAGE_HUBS[language]
  const breadcrumbs = buildBreadcrumbs(language, trail)
  return (
    <div className={PAGE_TOP_BAR}>
      <div className={PAGE_HEADER_INNER}>
        <header className="writing-topbar">
          <nav className="breadcrumbs learning-breadcrumbs" aria-label="Điều hướng">
            <ol role="list">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1
                const isFirst = index === 0
                return (
                  <li key={`${item.label}-${index}`}>
                    {index > 0 ? (
                      <ChevronRight
                        width={15}
                        height={15}
                        strokeWidth={2}
                        className="breadcrumb-separator"
                        aria-hidden
                      />
                    ) : null}
                    {item.href && !isLast ? (
                      <Link className="breadcrumb-link" href={item.href}>
                        {isFirst ? (
                          <GraduationCap width={17} height={17} strokeWidth={2} aria-hidden />
                        ) : (
                          <MapPin width={14} height={14} strokeWidth={2} aria-hidden />
                        )}
                        <span className="breadcrumb-label">{item.label}</span>
                      </Link>
                    ) : (
                      <span className="breadcrumb-current" aria-current={isLast ? "page" : undefined}>
                        {isFirst ? (
                          <GraduationCap width={17} height={17} strokeWidth={2} aria-hidden />
                        ) : (
                          <MapPin width={14} height={14} strokeWidth={2} aria-hidden />
                        )}
                        <span className="breadcrumb-label">{item.label}</span>
                      </span>
                    )}
                  </li>
                )
              })}
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
