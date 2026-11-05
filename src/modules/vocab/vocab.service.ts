import { NotFoundError } from "../../shared/errors"
import { mapVocabLessonStory, mapVocabLessonSummary } from "./vocab.mapper"
import type { VocabRepository } from "./vocab.repository"
import type { VocabLanguageCode } from "./vocab.constants"
import { normalizeVocabLevelCode } from "./vocab.constants"
import { mapVocabProgressRow } from "./vocab-progress.mapper"
import type { VocabProgressRepository } from "./vocab-progress.repository"
import type { VocabLevelDetailDto, VocabLessonStoryDto } from "./vocab.types"

export class VocabService {
  constructor(
    private readonly repo: VocabRepository,
    private readonly progressRepo?: VocabProgressRepository,
  ) {}

  async getLevelDetail(
    languageCode: VocabLanguageCode,
    levelCode: string,
    userId?: string,
  ): Promise<VocabLevelDetailDto> {
    const normalized = normalizeVocabLevelCode(levelCode)
    const curriculum = await this.repo.findCurriculum(languageCode, normalized)
    if (!curriculum) throw new NotFoundError("Vocab curriculum")

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
          const summary = mapVocabLessonSummary(lesson)
          const row = progressByLesson.get(lesson.id)
          if (!row) return summary
          const mapped = mapVocabProgressRow(row)
          return {
            ...summary,
            progress: {
              status: mapped.status,
              masteredCount: mapped.masteredCount,
              isCompleted: mapped.isCompleted,
            },
          }
        }),
      })),
    }
  }

  async getLessonStory(
    languageCode: VocabLanguageCode,
    levelCode: string,
    topicSlug: string,
    lessonSlug: string,
  ): Promise<VocabLessonStoryDto> {
    const bundle = await this.repo.findLessonBySlugs(
      languageCode,
      levelCode,
      topicSlug,
      lessonSlug,
    )
    if (!bundle) throw new NotFoundError("Vocab lesson")

    return mapVocabLessonStory(bundle.lesson, bundle.words, bundle.nextLessonDbId)
  }

  async getLessonStoryBySection(
    languageCode: VocabLanguageCode,
    levelCode: string,
    sectionId: string,
    lessonSlug: string,
    userId?: string,
  ): Promise<VocabLessonStoryDto> {
    const bundle = await this.repo.findLessonBySectionAndSlug(
      languageCode,
      levelCode,
      sectionId,
      lessonSlug,
    )
    if (!bundle) throw new NotFoundError("Vocab lesson")

    const dto = mapVocabLessonStory(bundle.lesson, bundle.words, bundle.nextLessonDbId)
    if (userId && this.progressRepo) {
      const row = await this.progressRepo.findProgress(userId, bundle.lesson.id)
      if (row) {
        const mapped = mapVocabProgressRow(row)
        dto.lessonProgress = {
          status: mapped.status,
          currentStep: mapped.currentStep,
          masteredCount: mapped.masteredCount,
          isCompleted: mapped.isCompleted,
        }
      }
    }
    return dto
  }
}
