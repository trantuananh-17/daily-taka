"use client"

import { useMemo, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "cn"

import { HEATMAP_LEVEL_LABELS, WEEKDAY_LABELS_VI } from "@/lib/user-activity/constants"
import { HEATMAP_LEVEL_CLASS, minutesToHeatmapLevel } from "@/lib/user-activity/heatmap-level"
import type { DailyActivity } from "@/lib/user-activity/types"
import { buildYearHeatmapGrid, heatmapMonthMarkers } from "@/lib/user-activity/year-heatmap-grid"

type ActivityYearHeatmapCardProps = {
  year: number
  days: DailyActivity[]
}

const ROW_LABELS = [WEEKDAY_LABELS_VI[0], WEEKDAY_LABELS_VI[2], WEEKDAY_LABELS_VI[4]] as const

export function ActivityYearHeatmapCard({ year, days }: ActivityYearHeatmapCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const columns = useMemo(() => buildYearHeatmapGrid(year, days), [year, days])
  const monthMarkers = useMemo(() => heatmapMonthMarkers(columns), [columns])

  function scrollBy(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <section className="rounded-2xl border border-[var(--dlx-hairline)] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-heading text-[11px] font-bold uppercase tracking-wide text-[var(--dlx-muted)]">
            Lịch sử hoạt động ({year})
          </p>
          <h2 className="mt-1 font-heading text-lg font-bold text-[var(--dlx-ink)]">
            Phân bổ thời gian học (phút)
          </h2>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-heading text-xs font-bold text-emerald-800">
          {year}
        </span>
      </div>

      <div className="relative mt-5">
        <div className="flex gap-2">
          <div className="flex w-7 shrink-0 flex-col justify-between pb-6 pt-5 text-[10px] font-bold text-[var(--dlx-muted)]">
            {ROW_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]"
          >
            <div className="relative min-w-max pl-0.5">
              <div className="relative mb-2 h-4">
                {monthMarkers.map((m) => (
                  <span
                    key={`${m.colIndex}-${m.label}`}
                    className="absolute top-0 font-heading text-[10px] font-bold uppercase text-[var(--dlx-muted)]"
                    style={{ left: m.colIndex * 15 }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-[3px]">
                {columns.map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-[3px]">
                    {col.days.map((cell, rowIndex) => {
                      if (!cell.date) {
                        return (
                          <div
                            key={rowIndex}
                            className="size-[12px] rounded-[3px] bg-transparent"
                            aria-hidden
                          />
                        )
                      }
                      const level = minutesToHeatmapLevel(cell.activeMinutes)
                      return (
                        <div
                          key={cell.date}
                          className={cn("size-[12px] rounded-[3px]", HEATMAP_LEVEL_CLASS[level])}
                          title={`${cell.date}: ${cell.activeMinutes} phút`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 font-body text-[11px] text-[var(--dlx-muted)]">
            <span>Ít</span>
            {([0, 1, 2, 3, 4] as const).map((level) => (
              <span key={level} className="flex items-center gap-1">
                <span className={cn("size-3 rounded-[3px]", HEATMAP_LEVEL_CLASS[level])} aria-hidden />
                {HEATMAP_LEVEL_LABELS[level]}
              </span>
            ))}
            <span>Nhiều</span>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => scrollBy(-120)}
              className="flex size-8 items-center justify-center rounded-lg border border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] text-[var(--dlx-ink)] hover:bg-white"
              aria-label="Cuộn trái"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(120)}
              className="flex size-8 items-center justify-center rounded-lg border border-[var(--dlx-hairline)] bg-[var(--dlx-neutral-1)] text-[var(--dlx-ink)] hover:bg-white"
              aria-label="Cuộn phải"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
