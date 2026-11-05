"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { authClient } from "@/lib/auth/client"
import { apiGetVocabLevelDetail } from "@/lib/learn/vocab/vocab-api"
import { apiGetWritingLevelDetail } from "@/lib/learn/writing/writing-api"
import { Search } from "lucide-react"
import { cn } from "cn"

import { searchCurriculumLessons } from "@/lib/learn/curriculum/search-curriculum-lessons"
import type { CurriculumLesson, CurriculumModule, CurriculumSectionSummary } from "@/lib/learn/curriculum/types"
import type { LanguageHubCode } from "@/lib/learn/hub"

import { LevelSectionPanel } from "./level-section-panel"
import { LevelSectionPanelSkeleton } from "./level-section-panel-skeleton"

const SEARCH_DEBOUNCE_MS = 320

type LevelTopicAccordionProps = {
  language: LanguageHubCode
  module: CurriculumModule
  level: string
  title: string
  subtitle: string
  kicker: string
  sections: CurriculumSectionSummary[]
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase()
}

function groupHitsBySection(
  hits: Array<CurriculumLesson & { sectionTitle: string }>,
): Map<string, CurriculumLesson[]> {
  const map = new Map<string, CurriculumLesson[]>()
  for (const hit of hits) {
    const { sectionTitle: _title, ...lesson } = hit
    const list = map.get(lesson.sectionId) ?? []
    list.push(lesson)
    map.set(lesson.sectionId, list)
  }
  return map
}

export function LevelTopicAccordion({
  language,
  module,
  level,
  title,
  subtitle,
  kicker,
  sections,
}: LevelTopicAccordionProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchHits, setSearchHits] = useState<Array<CurriculumLesson & { sectionTitle: string }> | null>(
    null,
  )
  const [sectionMatchCount, setSectionMatchCount] = useState(sections.length)
  const { data: session } = authClient.useSession()
  const [apiSectionCompleted, setApiSectionCompleted] = useState<Map<number, number>>(
    () => new Map(),
  )

  useEffect(() => {
    if (!session?.user || language !== "en" || (module !== "vocab" && module !== "writing")) {
      setApiSectionCompleted(new Map())
      return
    }
    let cancelled = false
    const loader =
      module === "vocab"
        ? apiGetVocabLevelDetail(language, level)
        : apiGetWritingLevelDetail(language, level)
    void loader
      .then((detail) => {
        if (cancelled) return
        const map = new Map<number, number>()
        for (const topic of detail.topics) {
          map.set(topic.sortOrder, topic.completedCount ?? 0)
        }
        setApiSectionCompleted(map)
      })
      .catch(() => {
        if (!cancelled) setApiSectionCompleted(new Map())
      })
    return () => {
      cancelled = true
    }
  }, [module, session?.user, language, level])

  const displaySections = useMemo(
    () =>
      sections.map((section) =>
        (module === "vocab" || module === "writing") && session?.user
          ? {
              ...section,
              completedCount: apiSectionCompleted.get(section.sortOrder) ?? section.completedCount,
            }
          : section,
      ),
    [sections, module, session?.user, apiSectionCompleted],
  )

  const lessonCacheRef = useRef(new Map<string, CurriculumLesson[]>())

  const normalizedQuery = normalizeQuery(debouncedQuery)
  const isSearchActive = normalizedQuery.length > 0

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [query])

  useEffect(() => {
    if (!isSearchActive) {
      setSearchHits(null)
      setSectionMatchCount(sections.length)
      setSearchLoading(false)
      return
    }

    let cancelled = false
    setSearchLoading(true)
    setSearchHits(null)
    setSectionMatchCount(0)

    searchCurriculumLessons({ language, module, level, q: debouncedQuery })
      .then((result) => {
        if (cancelled) return
        setSearchHits(result.hits)
        setSectionMatchCount(result.sectionMatchCount)
        setSearchLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setSearchHits([])
        setSectionMatchCount(0)
        setSearchLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isSearchActive, debouncedQuery, language, module, level, sections.length])

  const hitsBySection = useMemo(() => {
    if (!searchHits) return null
    return groupHitsBySection(searchHits)
  }, [searchHits])

  const visibleSections = useMemo(() => {
    if (!isSearchActive) return displaySections
    if (searchLoading && searchHits === null) return []
    if (!hitsBySection) return []
    return displaySections.filter((section) => hitsBySection.has(section.id))
  }, [displaySections, isSearchActive, searchLoading, searchHits, hitsBySection])

  const displayMatchCount = isSearchActive ? sectionMatchCount : sections.length
  const matchLabel = searchLoading
    ? "Đang tìm…"
    : `${displayMatchCount} chủ đề${isSearchActive ? " phù hợp" : ""}`

  const showEmptyResults = !searchLoading && visibleSections.length === 0

  return (
    <section aria-labelledby="level-curriculum-title">
      <header>
        <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-[var(--dlx-primary)]">
          {kicker}
        </p>
        <div className="mt-1 flex flex-col items-stretch gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="min-w-0 flex-1">
            <h1
              id="level-curriculum-title"
              className="m-0 font-heading text-[length:var(--dlx-h3-size)] leading-[var(--dlx-h3-leading)] font-extrabold text-[var(--dlx-ink)]"
            >
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-[length:var(--dlx-text-body-size)] leading-[var(--dlx-text-body-leading)] text-[var(--dlx-body)]">
              {subtitle}
            </p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 shadow-[rgba(35,58,44,0.03)_0_1px_3px] sm:w-[17.5rem] md:mt-0.5">
            <Search className="size-4 shrink-0 text-[var(--dlx-muted)]" strokeWidth={2} aria-hidden />
            <span className="sr-only">Tìm chủ đề hoặc bài học</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm chủ đề hoặc bài học"
              autoComplete="off"
              className="min-w-0 flex-1 border-0 bg-transparent font-body text-[13px] text-[var(--dlx-ink)] outline-none placeholder:text-[var(--dlx-muted)]"
            />
          </label>
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
            <LevelSectionPanelSkeleton />
            <LevelSectionPanelSkeleton />
            <LevelSectionPanelSkeleton />
          </>
        ) : showEmptyResults ? (
          <div
            className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center"
            role="status"
          >
            <p className="m-0 font-heading text-base font-bold text-[var(--dlx-ink)]">Không tìm thấy bài học</p>
            <p className="mt-2 max-w-md font-body text-sm text-[var(--dlx-body)]">Thử đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          visibleSections.map((section) => (
            <LevelSectionPanel
              key={section.id}
              section={section}
              language={language}
              module={module}
              level={level}
              isOpen={openSectionId === section.id}
              onToggle={() =>
                setOpenSectionId((current) => (current === section.id ? null : section.id))
              }
              searchLessons={
                isSearchActive && hitsBySection ? (hitsBySection.get(section.id) ?? []) : undefined
              }
              lessonCache={lessonCacheRef.current}
            />
          ))
        )}
      </div>
    </section>
  )
}
