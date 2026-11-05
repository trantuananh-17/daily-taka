import type {
  AdminDashboardLanguageModuleActivityDay,
  AdminDashboardLanguageCode,
  LanguageDashboardSlice,
} from "@/lib/admin-dashboard/types"
import { formatChartDay } from "@/lib/admin-dashboard/format"

export type LanguageActivitySlice = {
  language: AdminDashboardLanguageCode
  value: number
  fill: string
}

export type LanguageModuleDailyRow = {
  date: string
  label: string
  listen: number
  vocab: number
  writing: number
}

export function selectLanguageModuleDailyRows(
  days: AdminDashboardLanguageModuleActivityDay[],
  language: AdminDashboardLanguageCode,
): LanguageModuleDailyRow[] {
  return days.map((row) => ({
    date: row.date,
    label: formatChartDay(row.date),
    listen: row[language].listen,
    vocab: row[language].vocab,
    writing: row[language].writing,
  }))
}

function countLessonsInLanguage(row: LanguageDashboardSlice): number {
  let total = row.listen.lessonsPublished + row.listen.lessonsDraft
  if (row.vocab) total += row.vocab.lessons
  if (row.writing) total += row.writing.lessons
  return total
}

/** CMS lesson totals per hub language (listen + vocab + writing). */
export function selectLanguageLessonSlices(rows: LanguageDashboardSlice[]): LanguageActivitySlice[] {
  return rows.map((row) => ({
    language: row.language,
    value: countLessonsInLanguage(row),
    fill: `var(--color-${row.language})`,
  }))
}

export function formatListenPublishedDraft(row: LanguageDashboardSlice): string {
  return `${row.listen.lessonsPublished} / ${row.listen.lessonsDraft}`
}

export function formatVocabSummary(row: LanguageDashboardSlice): string | null {
  if (!row.vocab) return null
  return `${row.vocab.lessons} bài · ${row.vocab.words} từ`
}

export function formatWritingSummary(row: LanguageDashboardSlice): string | null {
  if (!row.writing) return null
  return `${row.writing.lessons} bài · ${row.writing.sentences} câu`
}

/** Listen lessons draft or missing audio — CMS backlog. */
export function sumListenCmsBacklog(rows: LanguageDashboardSlice[]): {
  draft: number
  missingAudio: number
  total: number
} {
  let draft = 0
  let missingAudio = 0
  for (const row of rows) {
    draft += row.listen.lessonsDraft
    missingAudio += row.listen.lessonsMissingAudio
  }
  return { draft, missingAudio, total: draft + missingAudio }
}
