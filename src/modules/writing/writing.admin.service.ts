import { NotFoundError } from "../../shared/errors"
import { mapWritingLessonSummary } from "./writing.mapper"
import type { WritingAdminRepository } from "./writing.admin.repository"
import type { UpsertWritingSentencesInput } from "./writing.admin.dto"
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
}
