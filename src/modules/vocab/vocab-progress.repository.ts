import { and, eq, inArray, sql } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import {
  userVocabLessonProgress,
  vocabLessons,
  vocabTopics,
} from "../../db/schema/vocab"

export class VocabProgressRepository {
  constructor(private readonly db: DbExecutor) {}

  async findProgress(userId: string, lessonId: string) {
    const rows = await this.db
      .select()
      .from(userVocabLessonProgress)
      .where(
        and(
          eq(userVocabLessonProgress.userId, userId),
          eq(userVocabLessonProgress.lessonId, lessonId),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async listProgressForLessons(userId: string, lessonIds: string[]) {
    if (lessonIds.length === 0) return new Map<string, typeof userVocabLessonProgress.$inferSelect>()
    const rows = await this.db
      .select()
      .from(userVocabLessonProgress)
      .where(
        and(
          eq(userVocabLessonProgress.userId, userId),
          inArray(userVocabLessonProgress.lessonId, lessonIds),
        ),
      )
    return new Map(rows.map((row) => [row.lessonId, row]))
  }

  async countCompletedByTopicIds(userId: string, topicIds: string[]) {
    if (topicIds.length === 0) return new Map<string, number>()

    const rows = await this.db
      .select({
        topicId: vocabLessons.topicId,
        count: sql<number>`count(*)::int`,
      })
      .from(userVocabLessonProgress)
      .innerJoin(vocabLessons, eq(userVocabLessonProgress.lessonId, vocabLessons.id))
      .where(
        and(
          eq(userVocabLessonProgress.userId, userId),
          eq(userVocabLessonProgress.status, "completed"),
          inArray(vocabLessons.topicId, topicIds),
        ),
      )
      .groupBy(vocabLessons.topicId)

    return new Map(rows.map((row) => [row.topicId, row.count]))
  }

  async upsertProgress(
    userId: string,
    lessonId: string,
    patch: {
      status?: string
      currentStep?: string
      masteredCount?: number
      completedAt?: Date | null
    },
  ) {
    const existing = await this.findProgress(userId, lessonId)
    const now = new Date()

    if (!existing) {
      const rows = await this.db
        .insert(userVocabLessonProgress)
        .values({
          userId,
          lessonId,
          status: patch.status ?? "in_progress",
          currentStep: patch.currentStep ?? "overview",
          masteredCount: patch.masteredCount ?? 0,
          completedAt: patch.completedAt ?? null,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
      return rows[0]!
    }

    const rows = await this.db
      .update(userVocabLessonProgress)
      .set({
        status: patch.status ?? existing.status,
        currentStep: patch.currentStep ?? existing.currentStep,
        masteredCount: patch.masteredCount ?? existing.masteredCount,
        completedAt:
          patch.completedAt !== undefined ? patch.completedAt : existing.completedAt,
        updatedAt: now,
      })
      .where(
        and(
          eq(userVocabLessonProgress.userId, userId),
          eq(userVocabLessonProgress.lessonId, lessonId),
        ),
      )
      .returning()
    return rows[0]!
  }

  async findLessonById(lessonId: string) {
    const rows = await this.db
      .select()
      .from(vocabLessons)
      .where(eq(vocabLessons.id, lessonId))
      .limit(1)
    return rows[0] ?? null
  }

  async findLessonIdByStoryId(languageCode: string, storyId: string) {
    const rows = await this.db
      .select({ id: vocabLessons.id })
      .from(vocabLessons)
      .where(and(eq(vocabLessons.languageCode, languageCode), eq(vocabLessons.storyId, storyId)))
      .limit(1)
    return rows[0]?.id ?? null
  }

  async listTopicIdsForCurriculum(curriculumId: string) {
    const rows = await this.db
      .select({ id: vocabTopics.id, sortOrder: vocabTopics.sortOrder })
      .from(vocabTopics)
      .where(eq(vocabTopics.curriculumId, curriculumId))
    return rows
  }
}
