import { and, eq, inArray, sql } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import {
  userWritingLessonProgress,
  writingLessons,
  writingTopics,
} from "../../db/schema/writing"

export class WritingProgressRepository {
  constructor(private readonly db: DbExecutor) {}

  async findProgress(userId: string, lessonId: string) {
    const rows = await this.db
      .select()
      .from(userWritingLessonProgress)
      .where(
        and(
          eq(userWritingLessonProgress.userId, userId),
          eq(userWritingLessonProgress.lessonId, lessonId),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async listProgressForLessons(userId: string, lessonIds: string[]) {
    if (lessonIds.length === 0) return new Map<string, typeof userWritingLessonProgress.$inferSelect>()
    const rows = await this.db
      .select()
      .from(userWritingLessonProgress)
      .where(
        and(
          eq(userWritingLessonProgress.userId, userId),
          inArray(userWritingLessonProgress.lessonId, lessonIds),
        ),
      )
    return new Map(rows.map((row) => [row.lessonId, row]))
  }

  async countCompletedByTopicIds(userId: string, topicIds: string[]) {
    if (topicIds.length === 0) return new Map<string, number>()
    const rows = await this.db
      .select({
        topicId: writingLessons.topicId,
        count: sql<number>`count(*)::int`,
      })
      .from(userWritingLessonProgress)
      .innerJoin(writingLessons, eq(userWritingLessonProgress.lessonId, writingLessons.id))
      .where(
        and(
          eq(userWritingLessonProgress.userId, userId),
          eq(userWritingLessonProgress.status, "completed"),
          inArray(writingLessons.topicId, topicIds),
        ),
      )
      .groupBy(writingLessons.topicId)
    return new Map(rows.map((row) => [row.topicId, row.count]))
  }

  async upsertProgress(
    userId: string,
    lessonId: string,
    patch: {
      status?: string
      currentSentenceIndex?: number
      doneSentenceIndexes?: number[]
      drafts?: Record<string, string>
      scriptModeId?: string | null
      completedAt?: Date | null
    },
  ) {
    const existing = await this.findProgress(userId, lessonId)
    const now = new Date()

    if (!existing) {
      const rows = await this.db
        .insert(userWritingLessonProgress)
        .values({
          userId,
          lessonId,
          status: patch.status ?? "in_progress",
          currentSentenceIndex: patch.currentSentenceIndex ?? 0,
          doneSentenceIndexes: patch.doneSentenceIndexes ?? [],
          drafts: patch.drafts ?? {},
          scriptModeId: patch.scriptModeId ?? null,
          completedAt: patch.completedAt ?? null,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
      return rows[0]!
    }

    const rows = await this.db
      .update(userWritingLessonProgress)
      .set({
        status: patch.status ?? existing.status,
        currentSentenceIndex: patch.currentSentenceIndex ?? existing.currentSentenceIndex,
        doneSentenceIndexes: patch.doneSentenceIndexes ?? existing.doneSentenceIndexes,
        drafts: patch.drafts ?? existing.drafts,
        scriptModeId:
          patch.scriptModeId !== undefined ? patch.scriptModeId : existing.scriptModeId,
        completedAt:
          patch.completedAt !== undefined ? patch.completedAt : existing.completedAt,
        updatedAt: now,
      })
      .where(
        and(
          eq(userWritingLessonProgress.userId, userId),
          eq(userWritingLessonProgress.lessonId, lessonId),
        ),
      )
      .returning()
    return rows[0]!
  }

  async findLessonById(lessonId: string) {
    const rows = await this.db
      .select()
      .from(writingLessons)
      .where(eq(writingLessons.id, lessonId))
      .limit(1)
    return rows[0] ?? null
  }
}
