"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"

import { countGuestCompletedInSection } from "@/lib/learn/listening/guest-listening-progress"
import { fetchListeningSectionLessons } from "@/lib/learn/listening/fetch-listening-section-lessons"
import { mockNetworkDelay } from "@/lib/learn/listening/mock/mock-network-delay"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type { ListeningLesson, ListeningSectionSummary } from "@/lib/learn/listening/types"

import { LessonCard } from "./lesson-card"
import { LessonGridSkeleton } from "./lesson-card-skeleton"

type SectionPanelProps = {
  section: ListeningSectionSummary
  language: LanguageHubCode
  categorySlug: string
  isOpen: boolean
  onToggle: () => void
  searchLessons?: ListeningLesson[]
  lessonCache: Map<string, ListeningLesson[]>
}

export function SectionPanel({
  section,
  language,
  categorySlug,
  isOpen,
  onToggle,
  searchLessons,
  lessonCache,
}: SectionPanelProps) {
  const [openLessons, setOpenLessons] = useState<ListeningLesson[] | null>(null)
  const [bodyLoading, setBodyLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const isSearchMode = searchLessons !== undefined
  const filteredCount = isSearchMode ? searchLessons.length : 0

  const guestCompleted = countGuestCompletedInSection(language, categorySlug, section.id)
  const completed = section.completedCount + guestCompleted
  const total = section.lessonCount
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0
  const panelId = `section-panel-${section.id}`

  useEffect(() => {
    if (!isOpen) {
      setOpenLessons(null)
      setBodyLoading(false)
      setLoadError(false)
      return
    }

    let cancelled = false
    setBodyLoading(true)
    setOpenLessons(null)
    setLoadError(false)

    async function loadSectionBody() {
      try {
        let rows: ListeningLesson[]

        if (isSearchMode) {
          await mockNetworkDelay()
          rows = searchLessons ?? []
        } else {
          const cached = lessonCache.get(section.id)
          const dataPromise = cached
            ? Promise.resolve(cached)
            : fetchListeningSectionLessons({
                language,
                categorySlug,
                sectionId: section.id,
              }).then((fetched) => {
                lessonCache.set(section.id, fetched)
                return fetched
              })

          const [, fetched] = await Promise.all([mockNetworkDelay(), dataPromise])
          rows = fetched
        }

        if (cancelled) return
        setOpenLessons(rows)
        setBodyLoading(false)
      } catch {
        if (cancelled) return
        setLoadError(true)
        setBodyLoading(false)
      }
    }

    void loadSectionBody()

    return () => {
      cancelled = true
    }
  }, [isOpen, isSearchMode, searchLessons, section.id, language, categorySlug, lessonCache])

  const skeletonCount = isSearchMode
    ? Math.min(Math.max(filteredCount, 3), 9)
    : Math.min(total, 9)

  return (
    <article
      id={`lesson-section-${section.id}`}
      className="overflow-hidden rounded-xl border border-border bg-white shadow-[rgba(35,58,44,0.04)_0_1px_4px]"
    >
      <h2 className="m-0">
        <button
          type="button"
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 border-0 px-4 py-3.5 text-left font-body text-[var(--dlx-ink)] transition-colors",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--dlx-primary)]",
            isOpen
              ? "rounded-t-xl border-b border-[color-mix(in_srgb,var(--dlx-hairline)_75%,var(--dlx-primary))] bg-[var(--dlx-neutral-1)]"
              : "bg-white",
          )}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <b className="font-heading text-[15px] font-bold text-[var(--dlx-ink)]">{section.title}</b>
            <small className="text-xs font-normal text-[var(--dlx-muted)]">
              Đã hoàn thành {completed}/{total} bài học
              {isSearchMode ? (
                <span className="text-[var(--dlx-body)]"> · {filteredCount} kết quả lọc</span>
              ) : null}
            </small>
          </span>
          <span
            className="inline-flex shrink-0 items-center gap-2.5 text-xs font-semibold text-[var(--dlx-muted)]"
            aria-hidden
          >
            <span>
              {completed}/{total}
            </span>
            <span className="hidden h-[5px] w-[5.5rem] overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--dlx-neutral-1)_55%,var(--dlx-hairline))] sm:block">
              <span
                className="block h-full rounded-full bg-[color-mix(in_srgb,var(--dlx-primary)_75%,#fff)]"
                style={{ width: `${progressPct}%` }}
              />
            </span>
          </span>
          <span className="hidden min-w-[2.75rem] shrink-0 text-right text-xs font-semibold text-[var(--dlx-muted)] sm:inline">
            {isOpen ? "Thu gọn" : "Mở"}
          </span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-[var(--dlx-muted)] transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            strokeWidth={2}
            aria-hidden
          />
        </button>
      </h2>
      {isOpen ? (
        <div id={panelId} className="bg-white px-4 pb-4 pt-3.5" role="region" aria-label={section.title}>
          {bodyLoading ? (
            <LessonGridSkeleton count={skeletonCount || 6} />
          ) : loadError ? (
            <p className="font-body text-sm text-[var(--dlx-body)]">
              Không tải được danh sách bài. Thử mở lại section.
            </p>
          ) : (openLessons?.length ?? 0) === 0 ? (
            <p className="font-body text-sm text-[var(--dlx-muted)]">Không có bài học trong phần này.</p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-3">
              {openLessons!.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  language={language}
                  categorySlug={categorySlug}
                />
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </article>
  )
}
