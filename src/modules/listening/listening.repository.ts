import { and, asc, eq, ilike, sql } from "drizzle-orm"

import { env } from "../../config/env"
import type { DbExecutor } from "../../db/client"
import {
  listeningCategories,
  listeningLessons,
  listeningSections,
  listeningSentences,
} from "../../db/schema/listening"
import { languages } from "../../db/schema/languages"
import type { ListeningLanguageCode } from "./listening.constants"

export class ListeningRepository {
  constructor(private readonly db: DbExecutor) {}

  async languageExists(code: ListeningLanguageCode): Promise<boolean> {
    const row = await this.db
      .select({ code: languages.code })
      .from(languages)
      .where(eq(languages.code, code))
      .limit(1)
    return row.length > 0
  }

  async listCategories(languageCode: ListeningLanguageCode) {
    return this.db
      .select()
      .from(listeningCategories)
      .where(
        and(
          eq(listeningCategories.languageCode, languageCode),
          eq(listeningCategories.isPublished, true),
        ),
      )
      .orderBy(asc(listeningCategories.sortOrder))
  }

  async findCategory(languageCode: ListeningLanguageCode, categorySlug: string) {
    const rows = await this.db
      .select()
      .from(listeningCategories)
      .where(
        and(
          eq(listeningCategories.languageCode, languageCode),
          eq(listeningCategories.slug, categorySlug),
          eq(listeningCategories.isPublished, true),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async listSections(categoryId: string) {
    const sections = await this.db
      .select()
      .from(listeningSections)
      .where(eq(listeningSections.categoryId, categoryId))
      .orderBy(asc(listeningSections.sortOrder))

    if (sections.length === 0) return []

    const counts = await this.db
      .select({
        sectionId: listeningLessons.sectionId,
        lessonCount: sql<number>`count(*)::int`,
      })
      .from(listeningLessons)
      .where(
        and(
          eq(listeningLessons.categoryId, categoryId),
          eq(listeningLessons.isPublished, true),
        ),
      )
      .groupBy(listeningLessons.sectionId)

    const countBySection = new Map(counts.map((row) => [row.sectionId, row.lessonCount]))

    return sections.map((section) => ({
      section,
      lessonCount: countBySection.get(section.id) ?? 0,
    }))
  }

  async listLessonsInSection(sectionId: string, levelCode?: string) {
    const conditions = [
      eq(listeningLessons.sectionId, sectionId),
      eq(listeningLessons.isPublished, true),
    ]
    if (levelCode && levelCode !== "all") {
      conditions.push(eq(listeningLessons.levelCode, levelCode))
    }

    return this.db
      .select()
      .from(listeningLessons)
      .where(and(...conditions))
      .orderBy(asc(listeningLessons.displayOrder))
  }

  async findLessonBySlug(
    languageCode: ListeningLanguageCode,
    categorySlug: string,
    sectionId: string,
    lessonSlug: string,
  ) {
    const category = await this.findCategory(languageCode, categorySlug)
    if (!category) return null

    const section = await this.db
      .select()
      .from(listeningSections)
      .where(
        and(eq(listeningSections.id, sectionId), eq(listeningSections.categoryId, category.id)),
      )
      .limit(1)
    if (!section[0]) return null

    const lessonRows = await this.db
      .select()
      .from(listeningLessons)
      .where(
        and(
          eq(listeningLessons.sectionId, sectionId),
          eq(listeningLessons.slug, lessonSlug),
          eq(listeningLessons.isPublished, true),
        ),
      )
      .limit(1)
    const lesson = lessonRows[0]
    if (!lesson) return null

    const sentences = await this.db
      .select()
      .from(listeningSentences)
      .where(eq(listeningSentences.lessonId, lesson.id))
      .orderBy(asc(listeningSentences.position))

    const next = await this.db
      .select()
      .from(listeningLessons)
      .where(
        and(
          eq(listeningLessons.sectionId, sectionId),
          eq(listeningLessons.isPublished, true),
          sql`${listeningLessons.displayOrder} > ${lesson.displayOrder}`,
        ),
      )
      .orderBy(asc(listeningLessons.displayOrder))
      .limit(1)

    return {
      category,
      section: section[0],
      lesson,
      sentences,
      nextLesson: next[0] ?? null,
    }
  }

  async searchLessons(
    categoryId: string,
    query: string,
    levelCode: string,
  ): Promise<
    Array<{
      lesson: typeof listeningLessons.$inferSelect
      section: typeof listeningSections.$inferSelect
    }>
  > {
    const conditions = [
      eq(listeningLessons.categoryId, categoryId),
      eq(listeningLessons.isPublished, true),
    ]
    if (levelCode !== "all") {
      conditions.push(eq(listeningLessons.levelCode, levelCode))
    }
    const normalized = query.trim()
    if (normalized.length > 0) {
      if (env.listeningSearchMode === "fts") {
        conditions.push(
          sql`${listeningLessons.searchVector} @@ plainto_tsquery('simple', ${normalized})`,
        )
      } else {
        conditions.push(ilike(listeningLessons.title, `%${normalized}%`))
      }
    }

    const rows = await this.db
      .select({
        lesson: listeningLessons,
        section: listeningSections,
      })
      .from(listeningLessons)
      .innerJoin(listeningSections, eq(listeningLessons.sectionId, listeningSections.id))
      .where(and(...conditions))
      .orderBy(asc(listeningSections.sortOrder), asc(listeningLessons.displayOrder))

    return rows
  }
}
