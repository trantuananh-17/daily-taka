import { NotFoundError } from "../../shared/errors"
import type { VocabAdminRepository } from "./vocab.admin.repository"
import type {
  CreateVocabLessonInput,
  CreateVocabTopicInput,
  UpsertVocabWordsInput,
  UpdateVocabLessonInput,
} from "./vocab.admin.dto"
import type { VocabLanguageCode } from "./vocab.constants"
import { normalizeVocabLevelCode } from "./vocab.constants"

export class VocabAdminService {
  constructor(private readonly repo: VocabAdminRepository) {}

  async getLevelTree(languageCode: VocabLanguageCode, levelCode: string) {
    const normalized = normalizeVocabLevelCode(levelCode)
    const curriculum = await this.repo.findCurriculum(languageCode, normalized)
    if (!curriculum) throw new NotFoundError("Vocab curriculum")

    const topicsWithLessons = await this.repo.listTopicsWithLessons(curriculum.id)
    return {
      curriculum,
      topics: topicsWithLessons.map(({ topic, lessons }) => ({
        topic,
        lessons: lessons.map((lesson) => ({
          id: lesson.id,
          storyId: lesson.storyId,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          wordCount: lesson.wordCount,
          sortOrder: lesson.sortOrder,
          isPublished: lesson.isPublished,
        })),
      })),
    }
  }

  async getLessonWithWords(languageCode: VocabLanguageCode, lessonId: string) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Vocab lesson")
    }
    const words = await this.repo.listWordsByLesson(lessonId)
    return { lesson, words }
  }

  async updateLesson(
    languageCode: VocabLanguageCode,
    lessonId: string,
    body: UpdateVocabLessonInput,
  ) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Vocab lesson")
    }
    const updated = await this.repo.updateLesson(lessonId, body)
    if (!updated) throw new NotFoundError("Vocab lesson")
    return updated
  }

  async upsertLessonWords(
    languageCode: VocabLanguageCode,
    lessonId: string,
    body: UpsertVocabWordsInput,
  ) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Vocab lesson")
    }
    return this.repo.replaceLessonWords(lessonId, body)
  }

  async createTopic(
    languageCode: VocabLanguageCode,
    levelCode: string,
    body: CreateVocabTopicInput,
  ) {
    const normalized = normalizeVocabLevelCode(levelCode)
    const curriculum = await this.repo.findCurriculum(languageCode, normalized)
    if (!curriculum) throw new NotFoundError("Vocab curriculum")

    const id = body.id ?? `topic-${languageCode}-vocab-${normalized.toLowerCase()}-${body.slug}`
    const row = await this.repo.insertTopic({
      id,
      curriculumId: curriculum.id,
      slug: body.slug,
      title: body.title,
      sortOrder: body.sortOrder ?? 0,
      isPublished: body.isPublished ?? true,
    })
    if (!row) throw new NotFoundError("Vocab topic")
    return row
  }

  async createLesson(
    languageCode: VocabLanguageCode,
    topicId: string,
    body: CreateVocabLessonInput,
  ) {
    const topic = await this.repo.findTopicById(topicId)
    if (!topic) throw new NotFoundError("Vocab topic")
    const curriculum = await this.repo.findCurriculumById(topic.curriculumId)
    if (!curriculum || curriculum.languageCode !== languageCode) {
      throw new NotFoundError("Vocab curriculum")
    }

    const id =
      body.id ?? `lesson-${languageCode}-vocab-${body.slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 48)}`
    const row = await this.repo.insertLesson({
      id,
      topicId,
      curriculumId: curriculum.id,
      languageCode,
      slug: body.slug,
      storyId: body.storyId,
      title: body.title,
      description: body.description ?? "",
      wordCount: 0,
      sortOrder: body.sortOrder ?? 0,
      nextStoryId: body.nextStoryId ?? null,
      nextStoryTitle: body.nextStoryTitle ?? null,
      isPublished: body.isPublished ?? true,
    })
    if (!row) throw new NotFoundError("Vocab lesson")
    return row
  }
}
