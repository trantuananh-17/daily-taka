import { and, asc, eq } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import {
  writingCurricula,
  writingLessons,
  writingSentences,
  writingTopics,
} from "../../db/schema/writing"
import type { WritingLanguageCode } from "./writing.constants"
import { normalizeWritingLevelCode } from "./writing.constants"

export class WritingRepository {
  constructor(private readonly db: DbExecutor) {}

  async findCurriculum(languageCode: WritingLanguageCode, levelCode: string) {
    const normalized = normalizeWritingLevelCode(levelCode)
    const rows = await this.db
      .select()
      .from(writingCurricula)
      .where(
        and(
          eq(writingCurricula.languageCode, languageCode),
          eq(writingCurricula.levelCode, normalized),
          eq(writingCurricula.isPublished, true),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async listTopicsWithLessons(curriculumId: string) {
    const topics = await this.db
      .select()
      .from(writingTopics)
      .where(
        and(eq(writingTopics.curriculumId, curriculumId), eq(writingTopics.isPublished, true)),
      )
      .orderBy(asc(writingTopics.sortOrder))

    const lessons = await this.db
      .select()
      .from(writingLessons)
      .where(
        and(eq(writingLessons.curriculumId, curriculumId), eq(writingLessons.isPublished, true)),
      )
      .orderBy(asc(writingLessons.sortOrder))

    const byTopic = new Map<string, typeof lessons>()
    for (const lesson of lessons) {
      const list = byTopic.get(lesson.topicId) ?? []
      list.push(lesson)
      byTopic.set(lesson.topicId, list)
    }

    return topics.map((topic) => ({
      topic,
      lessons: byTopic.get(topic.id) ?? [],
    }))
  }

  async findTopicBySectionId(curriculumId: string, sectionId: string) {
    const match = sectionId.match(/-(\d+)$/)
    const sectionNumber = match ? Number.parseInt(match[1] ?? "", 10) : NaN
    if (!Number.isFinite(sectionNumber)) return null

    const rows = await this.db
      .select()
      .from(writingTopics)
      .where(
        and(
          eq(writingTopics.curriculumId, curriculumId),
          eq(writingTopics.sortOrder, sectionNumber),
          eq(writingTopics.isPublished, true),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async findLessonBySectionAndSlug(
    languageCode: WritingLanguageCode,
    levelCode: string,
    sectionId: string,
    lessonSlug: string,
  ) {
    const curriculum = await this.findCurriculum(languageCode, levelCode)
    if (!curriculum) return null

    const topic = await this.findTopicBySectionId(curriculum.id, sectionId)
    if (!topic) return null

    const lessonRows = await this.db
      .select()
      .from(writingLessons)
      .where(
        and(
          eq(writingLessons.topicId, topic.id),
          eq(writingLessons.slug, lessonSlug),
          eq(writingLessons.isPublished, true),
        ),
      )
      .limit(1)
    const lesson = lessonRows[0]
    if (!lesson) return null

    const sentences = await this.db
      .select()
      .from(writingSentences)
      .where(eq(writingSentences.lessonId, lesson.id))
      .orderBy(asc(writingSentences.sortOrder))

    return { curriculum, topic, lesson, sentences }
  }
}
