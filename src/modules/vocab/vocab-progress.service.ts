import { NotFoundError } from "../../shared/errors"
import type { z } from "zod"
import type {
  guestVocabMergeBodySchema,
  upsertVocabProgressBodySchema,
} from "./vocab-progress.dto"
import { mapVocabProgressRow } from "./vocab-progress.mapper"
import type { VocabProgressRepository } from "./vocab-progress.repository"
import type { VocabLanguageCode } from "./vocab.constants"

type UpsertInput = z.infer<typeof upsertVocabProgressBodySchema>
type MergeInput = z.infer<typeof guestVocabMergeBodySchema>

function mergeStatus(
  guest: "in_progress" | "completed",
  existing: string | undefined,
): "not_started" | "in_progress" | "completed" {
  if (guest === "completed" || existing === "completed") return "completed"
  if (guest === "in_progress" || existing === "in_progress") return "in_progress"
  return "not_started"
}

function maxMastered(a: number, b: number) {
  return Math.max(a, b)
}

export class VocabProgressService {
  constructor(private readonly repo: VocabProgressRepository) {}

  async getProgress(userId: string, lessonId: string) {
    await this.assertLessonExists(lessonId)
    const row = await this.repo.findProgress(userId, lessonId)
    return row ? mapVocabProgressRow(row) : null
  }

  async upsertProgress(userId: string, lessonId: string, body: UpsertInput) {
    const lesson = await this.assertLessonExists(lessonId)
    const existing = await this.repo.findProgress(userId, lessonId)

    let status = body.status ?? existing?.status ?? "in_progress"
    let masteredCount = body.masteredCount ?? existing?.masteredCount ?? 0
    masteredCount = Math.min(masteredCount, lesson.wordCount)

    if (status === "completed" || masteredCount >= lesson.wordCount) {
      status = "completed"
      masteredCount = lesson.wordCount
    } else if (body.currentStep && body.currentStep !== "overview") {
      status = "in_progress"
    }

    const completedAt =
      status === "completed"
        ? existing?.completedAt ?? new Date()
        : existing?.completedAt ?? null

    const row = await this.repo.upsertProgress(userId, lessonId, {
      status,
      currentStep: body.currentStep ?? existing?.currentStep ?? "overview",
      masteredCount,
      completedAt: status === "completed" ? completedAt : null,
    })

    return mapVocabProgressRow(row)
  }

  async completeLesson(userId: string, lessonId: string, masteredCount?: number) {
    const lesson = await this.assertLessonExists(lessonId)
    const row = await this.repo.upsertProgress(userId, lessonId, {
      status: "completed",
      currentStep: "lessonComplete",
      masteredCount: masteredCount ?? lesson.wordCount,
      completedAt: new Date(),
    })
    return mapVocabProgressRow(row)
  }

  async mergeGuestData(userId: string, body: MergeInput) {
    let mergedLessons = 0
    let skippedLessons = 0
    let mergedCarry = 0

    for (const entry of body.lessonEntries) {
      if (entry.language !== "en") {
        skippedLessons += 1
        continue
      }
      const lesson = await this.repo.findLessonById(entry.lessonId)
      if (!lesson || lesson.languageCode !== entry.language) {
        skippedLessons += 1
        continue
      }

      const existing = await this.repo.findProgress(userId, entry.lessonId)
      const status = mergeStatus(entry.status, existing?.status)
      const masteredCount = maxMastered(entry.masteredCount, existing?.masteredCount ?? 0)

      await this.repo.upsertProgress(userId, entry.lessonId, {
        status,
        currentStep: entry.currentStep ?? existing?.currentStep ?? "overview",
        masteredCount: Math.min(masteredCount, lesson.wordCount),
        completedAt:
          status === "completed" ? (existing?.completedAt ?? new Date()) : existing?.completedAt,
      })
      mergedLessons += 1
    }

    return { mergedLessons, skippedLessons, mergedCarry: body.carryEntries.length }
  }

  async levelSectionProgress(
    userId: string,
    languageCode: VocabLanguageCode,
    curriculumId: string,
  ) {
    const topics = await this.repo.listTopicIdsForCurriculum(curriculumId)
    const counts = await this.repo.countCompletedByTopicIds(
      userId,
      topics.map((t) => t.id),
    )
    return topics.map((topic) => ({
      topicId: topic.id,
      sortOrder: topic.sortOrder,
      completedCount: counts.get(topic.id) ?? 0,
    }))
  }

  private async assertLessonExists(lessonId: string) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson) throw new NotFoundError("Vocab lesson")
    return lesson
  }
}
