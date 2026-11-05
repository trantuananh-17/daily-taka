import { and, eq, inArray, sql } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import { listeningLessons } from "../../db/schema/listening"
import {
  userListenLessonProgress,
  type UserListenLessonProgressRow,
} from "../../db/schema/user-learning"

export class ListeningProgressRepository {
  constructor(private readonly db: DbExecutor) {}

  async findProgress(userId: string, lessonId: string): Promise<UserListenLessonProgressRow | null> {
    const rows = await this.db
      .select()
      .from(userListenLessonProgress)
      .where(
        and(
          eq(userListenLessonProgress.userId, userId),
          eq(userListenLessonProgress.lessonId, lessonId),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async upsertProgress(
    userId: string,
    lessonId: string,
    patch: Partial<typeof userListenLessonProgress.$inferInsert>,
  ): Promise<UserListenLessonProgressRow> {
    const now = new Date()
    const rows = await this.db
      .insert(userListenLessonProgress)
      .values({
        userId,
        lessonId,
        ...patch,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [userListenLessonProgress.userId, userListenLessonProgress.lessonId],
        set: { ...patch, updatedAt: now },
      })
      .returning()
    return rows[0]!
  }

  async countCompletedInSections(userId: string, sectionIds: string[]): Promise<Map<string, number>> {
    if (sectionIds.length === 0) return new Map()

    const rows = await this.db
      .select({
        sectionId: listeningLessons.sectionId,
        completed: sql<number>`count(*)::int`,
      })
      .from(userListenLessonProgress)
      .innerJoin(listeningLessons, eq(userListenLessonProgress.lessonId, listeningLessons.id))
      .where(
        and(
          eq(userListenLessonProgress.userId, userId),
          eq(userListenLessonProgress.status, "completed"),
          inArray(listeningLessons.sectionId, sectionIds),
        ),
      )
      .groupBy(listeningLessons.sectionId)

    return new Map(rows.map((row) => [row.sectionId, row.completed]))
  }

  async listProgressForLessons(
    userId: string,
    lessonIds: string[],
  ): Promise<Map<string, UserListenLessonProgressRow>> {
    if (lessonIds.length === 0) return new Map()

    const rows = await this.db
      .select()
      .from(userListenLessonProgress)
      .where(
        and(
          eq(userListenLessonProgress.userId, userId),
          inArray(userListenLessonProgress.lessonId, lessonIds),
        ),
      )

    return new Map(rows.map((row) => [row.lessonId, row]))
  }
}
