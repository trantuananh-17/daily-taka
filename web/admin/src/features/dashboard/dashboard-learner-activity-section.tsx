"use client"

import { useMemo, useState } from "react"

import { DashboardLanguageLessonsPieChart } from "@/features/dashboard/components/dashboard-language-lessons-pie-chart"
import { DashboardLearningActivityPanel } from "@/features/dashboard/components/dashboard-learning-activity-panel"
import {
  filterByDateRange,
  getActivityDateBounds,
} from "@/lib/admin-dashboard/activity-range"
import {
  selectLanguageLessonSlices,
  selectLanguageModuleDailyRows,
} from "@/lib/admin-dashboard/selectors"
import type {
  AdminDashboardActivityDay,
  AdminDashboardLanguageModuleActivityDay,
  LanguageDashboardSlice,
} from "@/lib/admin-dashboard/types"

type DashboardLearnerActivitySectionProps = {
  byLanguage: LanguageDashboardSlice[]
  activity30d: AdminDashboardActivityDay[]
  languageModuleActivity30d: AdminDashboardLanguageModuleActivityDay[]
}

export function DashboardLearnerActivitySection({
  byLanguage,
  activity30d,
  languageModuleActivity30d,
}: DashboardLearnerActivitySectionProps) {
  const bounds = useMemo(() => getActivityDateBounds(activity30d), [activity30d])
  const [startDate, setStartDate] = useState(bounds.min)
  const [endDate, setEndDate] = useState(bounds.max)

  const filteredLanguageModule = useMemo(
    () => filterByDateRange(languageModuleActivity30d, startDate, endDate),
    [languageModuleActivity30d, startDate, endDate],
  )

  const lessonSlices = useMemo(() => selectLanguageLessonSlices(byLanguage), [byLanguage])
  const enRows = useMemo(
    () => selectLanguageModuleDailyRows(filteredLanguageModule, "en"),
    [filteredLanguageModule],
  )
  const zhRows = useMemo(
    () => selectLanguageModuleDailyRows(filteredLanguageModule, "zh"),
    [filteredLanguageModule],
  )
  const jpRows = useMemo(
    () => selectLanguageModuleDailyRows(filteredLanguageModule, "jp"),
    [filteredLanguageModule],
  )

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <DashboardLearningActivityPanel
        className="min-w-0 lg:col-span-2"
        enRows={enRows}
        zhRows={zhRows}
        jpRows={jpRows}
        startDate={startDate}
        endDate={endDate}
        bounds={bounds}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <DashboardLanguageLessonsPieChart className="min-w-0 lg:col-span-1" slices={lessonSlices} />
    </div>
  )
}
