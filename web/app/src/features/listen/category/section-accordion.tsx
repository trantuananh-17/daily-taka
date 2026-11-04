"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "cn"

import { useListeningSearchQuery } from "@/lib/learn/listening/use-listening-queries"
import type { LanguageHubCode } from "@/lib/learn/hub"
import type {
  ListeningCategory,
  ListeningLesson,
  ListeningLessonSearchHit,
  ListeningSectionSummary,
} from "@/lib/learn/listening/types"

import { SectionPanel } from "./section-panel"
import { SectionPanelSkeleton } from "./section-panel-skeleton"

const LISTEN_CATEGORY_SUBTITLE =
  "Khám phá các bài luyện nghe theo từng phần, trình độ và chủ đề bạn quan tâm."

const SEARCH_DEBOUNCE_MS = 320

type SectionAccordionProps = {
  language: LanguageHubCode
  category: ListeningCategory
  sections: ListeningSectionSummary[]
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase()
}

function groupHitsBySection(hits: ListeningLessonSearchHit[]): Map<string, ListeningLesson[]> {
  const map = new Map<string, ListeningLesson[]>()
  for (const hit of hits) {
    const { sectionTitle: _title, ...lesson } = hit
    const list = map.get(lesson.sectionId) ?? []
    list.push(lesson)
    map.set(lesson.sectionId, list)
  }
  return map
}

export function SectionAccordion({ language, category, sections }: SectionAccordionProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [sectionMatchCount, setSectionMatchCount] = useState(sections.length)

  const normalizedQuery = normalizeQuery(debouncedQuery)
  const isSearchActive = normalizedQuery.length > 0 || levelFilter !== "all"

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [query])

  const searchQuery = useListeningSearchQuery(
    language,
    category.slug,
    debouncedQuery,
    levelFilter,
    isSearchActive,
  )

  const searchLoading = isSearchActive && searchQuery.isLoading
  const searchHits: ListeningLessonSearchHit[] | null = !isSearchActive
    ? null
    : searchQuery.isError
      ? []
      : searchQuery.isLoading && !searchQuery.data
        ? null
        : (searchQuery.data?.hits ?? [])

  useEffect(() => {
    if (!isSearchActive) {
      setSectionMatchCount(sections.length)
      return
    }
    if (searchQuery.data) {
      setSectionMatchCount(searchQuery.data.sectionMatchCount)
    } else if (searchQuery.isError) {
      setSectionMatchCount(0)
    }
  }, [isSearchActive, searchQuery.data, searchQuery.isError, sections.length])

  const hitsBySection = useMemo(() => {
    if (!searchHits) return null
    return groupHitsBySection(searchHits)
  }, [searchHits])

  const visibleSections = useMemo(() => {
    if (!isSearchActive) {
      return sections
    }
    if (searchLoading && searchHits === null) {
      return []
    }
    if (!hitsBySection) {
      return []
    }
    return sections.filter((section) => hitsBySection.has(section.id))
  }, [sections, isSearchActive, searchLoading, searchHits, hitsBySection])

  const levelOptions = useMemo(() => {
    const fromCategory = [...category.levels].sort()
    if (fromCategory.length > 0) return fromCategory
    return ["A1", "A2", "B1", "B2"]
  }, [category.levels])

  const displayMatchCount = isSearchActive ? sectionMatchCount : sections.length
  const matchLabel = searchLoading ? "Đang tìm…" : `${displayMatchCount} phần phù hợp`

  const showEmptyResults = !searchLoading && visibleSections.length === 0

  return (
    <section aria-labelledby="listen-category-title">
      <header>
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="min-w-0 flex-1">
            <h1
              id="listen-category-title"
              className="m-0 font-heading text-[length:var(--dlx-h3-size)] leading-[var(--dlx-h3-leading)] font-extrabold text-[var(--dlx-ink)]"
            >
              {category.name}
            </h1>
            <p className="mt-2 max-w-xl text-[length:var(--dlx-text-body-size)] leading-[var(--dlx-text-body-leading)] text-[var(--dlx-body)]">
              {LISTEN_CATEGORY_SUBTITLE}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end md:mt-0.5 md:w-auto">
            <label className="flex w-full items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 shadow-[rgba(35,58,44,0.03)_0_1px_3px] sm:w-[17.5rem]">
              <Search className="size-4 shrink-0 text-[var(--dlx-muted)]" strokeWidth={2} aria-hidden />
              <span className="sr-only">Tìm theo tên bài học</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên bài học..."
                autoComplete="off"
                className="min-w-0 flex-1 border-0 bg-transparent font-body text-[13px] text-[var(--dlx-ink)] outline-none placeholder:text-[var(--dlx-muted)]"
              />
            </label>
            <label className="relative w-full sm:w-auto">
              <span className="sr-only">Lọc trình độ</span>
              <select
                value={levelFilter}
                onChange={(event) => setLevelFilter(event.target.value)}
                aria-label="Trình độ"
                className={cn(
                  "w-full appearance-none rounded-full border border-border bg-white py-2 pl-4 pr-9",
                  "font-body text-[13px] font-semibold text-[var(--dlx-ink)] shadow-[rgba(35,58,44,0.03)_0_1px_3px]",
                  "cursor-pointer outline-none sm:min-w-[9.5rem]",
                )}
              >
                <option value="all">Tất cả trình độ</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dlx-muted)]"
                strokeWidth={2}
                aria-hidden
              />
            </label>
          </div>
        </div>
      </header>

      <p
        className={cn(
          "mb-2.5 mt-4 font-body text-[13px] font-semibold text-[var(--dlx-muted)]",
          searchLoading && "animate-pulse",
        )}
        aria-live="polite"
      >
        {matchLabel}
      </p>

      <div className="flex min-h-[12rem] flex-1 flex-col gap-2">
        {searchLoading ? (
          <>
            <SectionPanelSkeleton />
            <SectionPanelSkeleton />
            <SectionPanelSkeleton />
          </>
        ) : showEmptyResults ? (
          <div
            className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center"
            role="status"
          >
            <p className="m-0 font-heading text-base font-bold text-[var(--dlx-ink)]">
              Không tìm thấy bài học
            </p>
            <p className="mt-2 max-w-md font-body text-sm text-[var(--dlx-body)]">
              {isSearchActive
                ? "Thử đổi từ khóa hoặc chọn「Tất cả trình độ」."
                : "Chủ đề này chưa có nội dung."}
            </p>
          </div>
        ) : (
          visibleSections.map((section) => (
            <SectionPanel
              key={section.id}
              section={section}
              language={language}
              categorySlug={category.slug}
              isOpen={openSectionId === section.id}
              onToggle={() =>
                setOpenSectionId((current) => (current === section.id ? null : section.id))
              }
              searchLessons={
                isSearchActive && hitsBySection
                  ? (hitsBySection.get(section.id) ?? [])
                  : undefined
              }
            />
          ))
        )}
      </div>
    </section>
  )
}
