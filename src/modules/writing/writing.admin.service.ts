import { NotFoundError } from "../../shared/errors"
import { mapWritingLessonSummary } from "./writing.mapper"
import type { WritingAdminRepository } from "./writing.admin.repository"
import type {
  CreateWritingLessonInput,
  CreateWritingTopicInput,
  UpdateWritingLessonInput,
  UpsertWritingSentencesInput,
} from "./writing.admin.dto"
import type { WritingLanguageCode } from "./writing.constants"
import { normalizeWritingLevelCode } from "./writing.constants"

export class WritingAdminService {
  constructor(private readonly repo: WritingAdminRepository) {}

  async getLevelTree(languageCode: WritingLanguageCode, levelCode: string) {
    const normalized = normalizeWritingLevelCode(levelCode)
    const curriculum = await this.repo.findCurriculum(languageCode, normalized)
    if (!curriculum) throw new NotFoundError("Writing curriculum")
    const topicsWithLessons = await this.repo.listTopicsWithLessons(curriculum.id)
    return {
      curriculum,
      topics: topicsWithLessons.map(({ topic, lessons }) => ({
        topic,
        lessons: lessons.map(mapWritingLessonSummary),
      })),
    }
  }

  async getLessonWithSentences(languageCode: WritingLanguageCode, lessonId: string) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Writing lesson")
    }
    const sentences = await this.repo.listSentences(lessonId)
    return { lesson, sentences }
  }

  async upsertLessonSentences(
    languageCode: WritingLanguageCode,
    lessonId: string,
    body: UpsertWritingSentencesInput,
  ) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Writing lesson")
    }
    return this.repo.replaceSentences(lessonId, body)
  }

  async updateLesson(
    languageCode: WritingLanguageCode,
    lessonId: string,
    body: UpdateWritingLessonInput,
  ) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Writing lesson")
    }
    const updated = await this.repo.updateLesson(lessonId, body)
    if (!updated) throw new NotFoundError("Writing lesson")
    return updated
  }

  async createTopic(
    languageCode: WritingLanguageCode,
    levelCode: string,
    body: CreateWritingTopicInput,
  ) {
    const normalized = normalizeWritingLevelCode(levelCode)
    const curriculum = await this.repo.findCurriculum(languageCode, normalized)
    if (!curriculum) throw new NotFoundError("Writing curriculum")

    const id = body.id ?? `topic-${languageCode}-writing-${normalized.toLowerCase()}-${body.slug}`
    const row = await this.repo.insertTopic({
      id,
      curriculumId: curriculum.id,
      slug: body.slug,
      title: body.title,
      sortOrder: body.sortOrder ?? 0,
      isPublished: body.isPublished ?? true,
    })
    if (!row) throw new NotFoundError("Writing topic")
    return row
  }

  async createLesson(
    languageCode: WritingLanguageCode,
    topicId: string,
    body: CreateWritingLessonInput,
  ) {
    const topic = await this.repo.findTopicById(topicId)
    if (!topic) throw new NotFoundError("Writing topic")
    const curriculum = await this.repo.findCurriculumById(topic.curriculumId)
    if (!curriculum || curriculum.languageCode !== languageCode) {
      throw new NotFoundError("Writing curriculum")
    }

    const levelCode = body.levelCode ?? curriculum.levelCode
    const id =
      body.id ?? `lesson-${languageCode}-writing-${body.slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 48)}`
    const row = await this.repo.insertLesson({
      id,
      topicId,
      curriculumId: curriculum.id,
      languageCode,
      slug: body.slug,
      contentId: body.contentId,
      title: body.title,
      levelCode,
      sentenceCount: 0,
      scriptModes: body.scriptModes ?? null,
      sortOrder: body.sortOrder ?? 0,
      isPublished: body.isPublished ?? true,
    })
    if (!row) throw new NotFoundError("Writing lesson")
    return row
  }
}
