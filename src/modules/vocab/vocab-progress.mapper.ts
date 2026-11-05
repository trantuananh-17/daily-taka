import type { userVocabLessonProgress } from "../../db/schema/vocab"

type ProgressRow = typeof userVocabLessonProgress.$inferSelect

export function mapVocabProgressRow(row: ProgressRow) {
  return {
    lessonId: row.lessonId,
    status: row.status as "not_started" | "in_progress" | "completed",
    currentStep: row.currentStep,
    masteredCount: row.masteredCount,
    isCompleted: row.status === "completed",
    completedAt: row.completedAt?.toISOString() ?? null,
  }
}
