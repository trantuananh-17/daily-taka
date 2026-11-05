import { and, asc, eq } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import {
  writingCurricula,
  writingLessons,
  writingSentences,
  writingTopics,
} from "../../db/schema/writing"
import type { UpsertWritingSentencesInput } from "./writing.admin.dto"
import type { WritingLanguageCode } from "./writing.constants"
import { normalizeWritingLevelCode } from "./writing.constants"

export class WritingAdminRepository {
  constructor(private readonly db: DbExecutor) {}

  async findCurriculumById(curriculumId: string) {
    const rows = await this.db
      .select()
      .from(writingCurricula)
      .where(eq(writingCurricula.id, curriculumId))
      .limit(1)
    return rows[0] ?? null
  }

  async findTopicById(topicId: string) {
    const rows = await this.db
      .select()
      .from(writingTopics)
      .where(eq(writingTopics.id, topicId))
      .limit(1)
    return rows[0] ?? null
  }

  async findCurriculum(languageCode: WritingLanguageCode, levelCode: string) {
    const normalized = normalizeWritingLevelCode(levelCode)
    const rows = await this.db
      .select()
      .from(writingCurricula)
      .where(
        and(
          eq(writingCurricula.languageCode, languageCode),
          eq(writingCurricula.levelCode, normalized),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async listTopicsWithLessons(curriculumId: string) {
    const topics = await this.db
      .select()
      .from(writingTopics)
      .where(eq(writingTopics.curriculumId, curriculumId))
      .orderBy(asc(writingTopics.sortOrder))
    const lessons = await this.db
      .select()
      .from(writingLessons)
      .where(eq(writingLessons.curriculumId, curriculumId))
      .orderBy(asc(writingLessons.sortOrder))
    const byTopic = new Map<string, typeof lessons>()
    for (const lesson of lessons) {
      const list = byTopic.get(lesson.topicId) ?? []
      list.push(lesson)
      byTopic.set(lesson.topicId, list)
    }
    return topics.map((topic) => ({ topic, lessons: byTopic.get(topic.id) ?? [] }))
  }

  async findLessonById(lessonId: string) {
    const rows = await this.db
      .select()
      .from(writingLessons)
      .where(eq(writingLessons.id, lessonId))
      .limit(1)
    return rows[0] ?? null
  }

  async listSentences(lessonId: string) {
    return this.db
      .select()
      .from(writingSentences)
      .where(eq(writingSentences.lessonId, lessonId))
      .orderBy(asc(writingSentences.sortOrder))
  }

  async insertTopic(input: {
    id: string
    curriculumId: string
    slug: string
    title: string
    sortOrder: number
    isPublished: boolean
  }) {
    const rows = await this.db.insert(writingTopics).values(input).returning()
    return rows[0] ?? null
  }

  async insertLesson(input: {
    id: string
    topicId: string
    curriculumId: string
    languageCode: string
    slug: string
    contentId: string
    title: string
    levelCode: string
    sentenceCount: number
    scriptModes: typeof writingLessons.$inferInsert.scriptModes
    sortOrder: number
    isPublished: boolean
  }) {
    const rows = await this.db.insert(writingLessons).values(input).returning()
    return rows[0] ?? null
  }

  async updateLesson(
    lessonId: string,
    patch: Partial<{
      title: string
      slug: string
      contentId: string
      levelCode: string
      sentenceCount: number
      sortOrder: number
      scriptModes: typeof writingLessons.$inferInsert.scriptModes
      isPublished: boolean
    }>,
  ) {
    const rows = await this.db
      .update(writingLessons)
      .set(patch)
      .where(eq(writingLessons.id, lessonId))
      .returning()
    return rows[0] ?? null
  }

  async replaceSentences(lessonId: string, body: UpsertWritingSentencesInput) {
    await this.db.delete(writingSentences).where(eq(writingSentences.lessonId, lessonId))
    const rows = body.sentences.map((sentence, index) => ({
      id: `${lessonId}:s${sentence.sortOrder ?? index + 1}`,
      lessonId,
      sortOrder: sentence.sortOrder ?? index + 1,
      promptVi: sentence.promptVi,
      targetDefault: sentence.targetDefault,
      targetsByMode: sentence.targetsByMode ?? {},
      pronunciationKind: sentence.pronunciationKind ?? null,
      pronunciation: sentence.pronunciation ?? [],
    }))
    if (rows.length) await this.db.insert(writingSentences).values(rows)
    await this.db
      .update(writingLessons)
      .set({ sentenceCount: rows.length })
      .where(eq(writingLessons.id, lessonId))
    return this.listSentences(lessonId)
  }
}
