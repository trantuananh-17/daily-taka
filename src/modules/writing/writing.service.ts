import { NotFoundError } from "../../shared/errors"
import { mapWritingLessonDetail, mapWritingLessonSummary } from "./writing.mapper"
import { mapWritingProgressRow } from "./writing-progress.mapper"
import type { WritingProgressRepository } from "./writing-progress.repository"
import type { WritingRepository } from "./writing.repository"
import type { WritingLanguageCode } from "./writing.constants"
import { normalizeWritingLevelCode } from "./writing.constants"
import type { WritingLevelDetailDto, WritingLessonDto } from "./writing.types"

export class WritingService {
  constructor(
    private readonly repo: WritingRepository,
    private readonly progressRepo?: WritingProgressRepository,
  ) {}

  async getLevelDetail(
    languageCode: WritingLanguageCode,
    levelCode: string,
    userId?: string,
  ): Promise<WritingLevelDetailDto> {
    const normalized = normalizeWritingLevelCode(levelCode)
    const curriculum = await this.repo.findCurriculum(languageCode, normalized)
    if (!curriculum) throw new NotFoundError("Writing curriculum")

    const topicsWithLessons = await this.repo.listTopicsWithLessons(curriculum.id)
    const completedByTopic =
      userId && this.progressRepo
        ? await this.progressRepo.countCompletedByTopicIds(
            userId,
            topicsWithLessons.map(({ topic }) => topic.id),
          )
        : new Map<string, number>()

    const allLessonIds = topicsWithLessons.flatMap(({ lessons }) => lessons.map((l) => l.id))
    const progressByLesson =
      userId && this.progressRepo
        ? await this.progressRepo.listProgressForLessons(userId, allLessonIds)
        : new Map()

    return {
      language: languageCode,
      level: normalized,
      topics: topicsWithLessons.map(({ topic, lessons }) => ({
        id: topic.id,
        slug: topic.slug,
        title: topic.title,
        sortOrder: topic.sortOrder,
        completedCount: completedByTopic.get(topic.id) ?? 0,
        lessons: lessons.map((lesson) => {
          const summary = mapWritingLessonSummary(lesson)
          const row = progressByLesson.get(lesson.id)
          if (!row) return summary
          const mapped = mapWritingProgressRow(row)
          return {
            ...summary,
            progress: {
              status: mapped.status,
              doneCount: mapped.doneCount,
              isCompleted: mapped.isCompleted,
            },
          }
        }),
      })),
    }
  }

  async getLessonBySection(
    languageCode: WritingLanguageCode,
    levelCode: string,
    sectionId: string,
    lessonSlug: string,
    userId?: string,
  ): Promise<WritingLessonDto> {
    const bundle = await this.repo.findLessonBySectionAndSlug(
      languageCode,
      levelCode,
      sectionId,
      lessonSlug,
    )
    if (!bundle) throw new NotFoundError("Writing lesson")

    const dto = mapWritingLessonDetail(bundle.lesson, bundle.sentences)
    if (userId && this.progressRepo) {
      const row = await this.progressRepo.findProgress(userId, bundle.lesson.id)
      if (row) {
        const mapped = mapWritingProgressRow(row)
        dto.progress = {
          currentSentenceIndex: mapped.currentSentenceIndex,
          doneSentenceIndexes: mapped.doneSentenceIndexes,
          drafts: mapped.drafts,
        }
      }
    }
    return dto
  }
}
