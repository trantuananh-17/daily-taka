import { and, asc, eq } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import {
  vocabCurricula,
  vocabLessons,
  vocabTopics,
  vocabWords,
} from "../../db/schema/vocab"
import type { VocabLanguageCode } from "./vocab.constants"
import { normalizeVocabLevelCode } from "./vocab.constants"

export class VocabRepository {
  constructor(private readonly db: DbExecutor) {}

  async findCurriculum(languageCode: VocabLanguageCode, levelCode: string) {
    const normalized = normalizeVocabLevelCode(levelCode)
    const rows = await this.db
      .select()
      .from(vocabCurricula)
      .where(
        and(
          eq(vocabCurricula.languageCode, languageCode),
          eq(vocabCurricula.levelCode, normalized),
          eq(vocabCurricula.isPublished, true),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async listTopicsWithLessons(curriculumId: string) {
    const topics = await this.db
      .select()
      .from(vocabTopics)
      .where(and(eq(vocabTopics.curriculumId, curriculumId), eq(vocabTopics.isPublished, true)))
      .orderBy(asc(vocabTopics.sortOrder))

    if (topics.length === 0) return []

    const lessons = await this.db
      .select()
      .from(vocabLessons)
      .where(
        and(eq(vocabLessons.curriculumId, curriculumId), eq(vocabLessons.isPublished, true)),
      )
      .orderBy(asc(vocabLessons.sortOrder))

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

    const topicRows = await this.db
      .select()
      .from(vocabTopics)
      .where(
        and(
          eq(vocabTopics.curriculumId, curriculumId),
          eq(vocabTopics.sortOrder, sectionNumber),
          eq(vocabTopics.isPublished, true),
        ),
      )
      .limit(1)
    return topicRows[0] ?? null
  }

  async findLessonBySectionAndSlug(
    languageCode: VocabLanguageCode,
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
      .from(vocabLessons)
      .where(
        and(
          eq(vocabLessons.topicId, topic.id),
          eq(vocabLessons.slug, lessonSlug),
          eq(vocabLessons.isPublished, true),
        ),
      )
      .limit(1)
    const lesson = lessonRows[0]
    if (!lesson) return null

    const words = await this.db
      .select()
      .from(vocabWords)
      .where(eq(vocabWords.lessonId, lesson.id))
      .orderBy(asc(vocabWords.sortOrder))

    const nextLessonDbId = await this.findNextLessonDbId(topic.id, lesson.nextStoryId)

    return { curriculum, topic, lesson, words, nextLessonDbId }
  }

  async findNextLessonDbId(topicId: string, nextStoryId: string | null) {
    if (!nextStoryId) return null
    const rows = await this.db
      .select({ id: vocabLessons.id })
      .from(vocabLessons)
      .where(and(eq(vocabLessons.topicId, topicId), eq(vocabLessons.storyId, nextStoryId)))
      .limit(1)
    return rows[0]?.id ?? null
  }

  async findLessonBySlugs(
    languageCode: VocabLanguageCode,
    levelCode: string,
    topicSlug: string,
    lessonSlug: string,
  ) {
    const curriculum = await this.findCurriculum(languageCode, levelCode)
    if (!curriculum) return null

    const topicRows = await this.db
      .select()
      .from(vocabTopics)
      .where(
        and(
          eq(vocabTopics.curriculumId, curriculum.id),
          eq(vocabTopics.slug, topicSlug),
          eq(vocabTopics.isPublished, true),
        ),
      )
      .limit(1)
    const topic = topicRows[0]
    if (!topic) return null

    const lessonRows = await this.db
      .select()
      .from(vocabLessons)
      .where(
        and(
          eq(vocabLessons.topicId, topic.id),
          eq(vocabLessons.slug, lessonSlug),
          eq(vocabLessons.isPublished, true),
        ),
      )
      .limit(1)
    const lesson = lessonRows[0]
    if (!lesson) return null

    const words = await this.db
      .select()
      .from(vocabWords)
      .where(eq(vocabWords.lessonId, lesson.id))
      .orderBy(asc(vocabWords.sortOrder))

    const nextLessonDbId = await this.findNextLessonDbId(topic.id, lesson.nextStoryId)

    return { curriculum, topic, lesson, words, nextLessonDbId }
  }
}
