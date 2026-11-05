import { and, asc, count, eq } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import {
  listeningCategories,
  listeningLessons,
  listeningSections,
  listeningSentences,
  type ListeningCategoryRow,
  type ListeningLessonRow,
  type ListeningSectionRow,
} from "../../db/schema/listening"
import type { ListeningLanguageCode } from "./listening.constants"

export class ListeningAdminRepository {
  constructor(private readonly db: DbExecutor) {}

  async listCategoriesByLanguage(languageCode: ListeningLanguageCode) {
    return this.db
      .select()
      .from(listeningCategories)
      .where(eq(listeningCategories.languageCode, languageCode))
      .orderBy(asc(listeningCategories.sortOrder))
  }

  async listSectionsByCategory(categoryId: string) {
    return this.db
      .select()
      .from(listeningSections)
      .where(eq(listeningSections.categoryId, categoryId))
      .orderBy(asc(listeningSections.sortOrder))
  }

  async listLessonsBySection(sectionId: string) {
    return this.db
      .select()
      .from(listeningLessons)
      .where(eq(listeningLessons.sectionId, sectionId))
      .orderBy(asc(listeningLessons.displayOrder))
  }

  async listSentencesByLesson(lessonId: string) {
    return this.db
      .select()
      .from(listeningSentences)
      .where(eq(listeningSentences.lessonId, lessonId))
      .orderBy(asc(listeningSentences.position))
  }

  async findCategoryById(categoryId: string): Promise<ListeningCategoryRow | null> {
    const rows = await this.db
      .select()
      .from(listeningCategories)
      .where(eq(listeningCategories.id, categoryId))
      .limit(1)
    return rows[0] ?? null
  }

  async findCategoryBySlug(
    languageCode: ListeningLanguageCode,
    slug: string,
  ): Promise<ListeningCategoryRow | null> {
    const rows = await this.db
      .select()
      .from(listeningCategories)
      .where(
        and(eq(listeningCategories.languageCode, languageCode), eq(listeningCategories.slug, slug)),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async insertCategory(values: typeof listeningCategories.$inferInsert) {
    const rows = await this.db.insert(listeningCategories).values(values).returning()
    return rows[0]
  }

  async updateCategory(categoryId: string, patch: Partial<typeof listeningCategories.$inferInsert>) {
    const rows = await this.db
      .update(listeningCategories)
      .set(patch)
      .where(eq(listeningCategories.id, categoryId))
      .returning()
    return rows[0] ?? null
  }

  async deleteCategory(categoryId: string) {
    await this.db.delete(listeningCategories).where(eq(listeningCategories.id, categoryId))
  }

  async findSection(sectionId: string): Promise<ListeningSectionRow | null> {
    const rows = await this.db
      .select()
      .from(listeningSections)
      .where(eq(listeningSections.id, sectionId))
      .limit(1)
    return rows[0] ?? null
  }

  async insertSection(values: typeof listeningSections.$inferInsert) {
    const rows = await this.db.insert(listeningSections).values(values).returning()
    return rows[0]
  }

  async updateSection(sectionId: string, patch: Partial<typeof listeningSections.$inferInsert>) {
    const rows = await this.db
      .update(listeningSections)
      .set(patch)
      .where(eq(listeningSections.id, sectionId))
      .returning()
    return rows[0] ?? null
  }

  async deleteSection(sectionId: string) {
    await this.db.delete(listeningSections).where(eq(listeningSections.id, sectionId))
  }

  async findLesson(lessonId: string): Promise<ListeningLessonRow | null> {
    const rows = await this.db
      .select()
      .from(listeningLessons)
      .where(eq(listeningLessons.id, lessonId))
      .limit(1)
    return rows[0] ?? null
  }

  async insertLesson(values: typeof listeningLessons.$inferInsert) {
    const rows = await this.db.insert(listeningLessons).values(values).returning()
    return rows[0]
  }

  async updateLesson(lessonId: string, patch: Partial<typeof listeningLessons.$inferInsert>) {
    const rows = await this.db
      .update(listeningLessons)
      .set(patch)
      .where(eq(listeningLessons.id, lessonId))
      .returning()
    return rows[0] ?? null
  }

  async deleteLesson(lessonId: string) {
    await this.db.delete(listeningLessons).where(eq(listeningLessons.id, lessonId))
  }

  async replaceLessonSentences(
    lessonId: string,
    sentences: Array<{
      position: number
      startMs: number
      endMs: number
      transcript: string
      metadata?: Record<string, unknown>
    }>,
  ) {
    await this.db.delete(listeningSentences).where(eq(listeningSentences.lessonId, lessonId))
    if (sentences.length === 0) return []
    const rows = await this.db
      .insert(listeningSentences)
      .values(
        sentences.map((row) => ({
          lessonId,
          position: row.position,
          startMs: row.startMs,
          endMs: row.endMs,
          transcript: row.transcript,
          metadata: row.metadata ?? {},
        })),
      )
      .returning()
    return rows
  }

  async findSentence(sentenceId: string) {
    const rows = await this.db
      .select()
      .from(listeningSentences)
      .where(eq(listeningSentences.id, sentenceId))
      .limit(1)
    return rows[0] ?? null
  }

  async updateSentence(
    sentenceId: string,
    patch: Partial<typeof listeningSentences.$inferInsert>,
  ) {
    const rows = await this.db
      .update(listeningSentences)
      .set(patch)
      .where(eq(listeningSentences.id, sentenceId))
      .returning()
    return rows[0] ?? null
  }

  async deleteSentence(sentenceId: string) {
    await this.db.delete(listeningSentences).where(eq(listeningSentences.id, sentenceId))
  }

  async recomputeCategoryStats(categoryId: string) {
    const [{ value: lessonTotal }] = await this.db
      .select({ value: count() })
      .from(listeningLessons)
      .where(
        and(eq(listeningLessons.categoryId, categoryId), eq(listeningLessons.isPublished, true)),
      )

    const levelRows = await this.db
      .selectDistinct({ levelCode: listeningLessons.levelCode })
      .from(listeningLessons)
      .where(
        and(eq(listeningLessons.categoryId, categoryId), eq(listeningLessons.isPublished, true)),
      )
      .orderBy(asc(listeningLessons.levelCode))

    const levels = levelRows.map((row) => row.levelCode)

    await this.db
      .update(listeningCategories)
      .set({ lessonCount: lessonTotal, levels })
      .where(eq(listeningCategories.id, categoryId))
  }

  async updateLessonSentenceCount(lessonId: string) {
    const [{ value: total }] = await this.db
      .select({ value: count() })
      .from(listeningSentences)
      .where(eq(listeningSentences.lessonId, lessonId))

    await this.db
      .update(listeningLessons)
      .set({ sentenceCount: total })
      .where(eq(listeningLessons.id, lessonId))
  }
}
