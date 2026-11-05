import type { userWritingLessonProgress } from "../../db/schema/writing"

type ProgressRow = typeof userWritingLessonProgress.$inferSelect

function parseDrafts(raw: Record<string, string>): Record<number, string> {
  const out: Record<number, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    const index = Number.parseInt(key, 10)
    if (Number.isFinite(index)) out[index] = value
  }
  return out
}

export function mapWritingProgressRow(row: ProgressRow) {
  const doneCount = row.doneSentenceIndexes.length
  return {
    lessonId: row.lessonId,
    status: row.status as "in_progress" | "completed",
    currentSentenceIndex: row.currentSentenceIndex,
    doneSentenceIndexes: row.doneSentenceIndexes,
    drafts: parseDrafts(row.drafts ?? {}),
    scriptModeId: row.scriptModeId,
    doneCount,
    isCompleted: row.status === "completed",
    completedAt: row.completedAt?.toISOString() ?? null,
  }
}

export function draftsToStorage(drafts: Record<number, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(drafts)) {
    out[String(key)] = value
  }
  return out
}
