import { NotFoundError } from "../../shared/errors"
import { mapVocabLessonSummary } from "./vocab.mapper"
import type { VocabAdminRepository } from "./vocab.admin.repository"
import type { UpsertVocabWordsInput, UpdateVocabLessonInput } from "./vocab.admin.dto"
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
        lessons: lessons.map(mapVocabLessonSummary),
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
}
