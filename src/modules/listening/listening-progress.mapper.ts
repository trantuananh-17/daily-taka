import type { UserListenLessonProgressRow } from "../../db/schema/user-learning"

export type UserListenLessonProgressDto = {
  lessonId: string
  status: "not_started" | "in_progress" | "completed"
  completedSentenceCount: number
  lastSentencePosition: number
  lastPositionMs: number | null
  completionCount: number
  completionCycleActive: boolean
  isStarred: boolean
  starCount: number
  completedAt: string | null
  isCompleted: boolean
}

export function mapListenProgressRow(row: UserListenLessonProgressRow): UserListenLessonProgressDto {
  return {
    lessonId: row.lessonId,
    status: row.status as UserListenLessonProgressDto["status"],
    completedSentenceCount: row.completedSentenceCount,
    lastSentencePosition: row.lastSentencePosition,
    lastPositionMs: row.lastPositionMs,
    completionCount: row.completionCount,
    completionCycleActive: row.completionCycleActive,
    isStarred: row.isStarred,
    starCount: row.starCount,
    completedAt: row.completedAt?.toISOString() ?? null,
    isCompleted: row.status === "completed",
  }
}
