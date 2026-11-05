import { NotFoundError } from "../../shared/errors"
import type { ListeningAdminRepository } from "./listening.admin.repository"
import type { z } from "zod"
import type {
  guestProgressMergeBodySchema,
  patchListenStarBodySchema,
  upsertListenProgressBodySchema,
} from "./listening-progress.dto"
import { mapListenProgressRow } from "./listening-progress.mapper"
import type { ListeningProgressRepository } from "./listening-progress.repository"
import type { UserSettingsService } from "../user-settings/user-settings.service"

type UpsertInput = z.infer<typeof upsertListenProgressBodySchema>
type StarInput = z.infer<typeof patchListenStarBodySchema>
type MergeInput = z.infer<typeof guestProgressMergeBodySchema>

export class ListeningProgressService {
  constructor(
    private readonly progressRepo: ListeningProgressRepository,
    private readonly adminRepo: ListeningAdminRepository,
    private readonly settingsService: UserSettingsService,
  ) {}

  async getProgress(userId: string, lessonId: string) {
    await this.assertLessonExists(lessonId)
    const row = await this.progressRepo.findProgress(userId, lessonId)
    return row ? mapListenProgressRow(row) : null
  }

  async upsertProgress(userId: string, lessonId: string, body: UpsertInput) {
    const lesson = await this.adminRepo.findLesson(lessonId)
    if (!lesson) throw new NotFoundError("Listening lesson")

    const existing = await this.progressRepo.findProgress(userId, lessonId)
    const sentenceCount = lesson.sentenceCount

    let status = body.status ?? existing?.status ?? "in_progress"
    let completedSentenceCount =
      body.completedSentenceCount ?? existing?.completedSentenceCount ?? 0

    if (completedSentenceCount >= sentenceCount && sentenceCount > 0) {
      status = "completed"
      completedSentenceCount = sentenceCount
    } else if (completedSentenceCount > 0 || (body.lastSentencePosition ?? 0) > 1) {
      status = status === "completed" ? "completed" : "in_progress"
    }

    const row = await this.progressRepo.upsertProgress(userId, lessonId, {
      status,
      completedSentenceCount,
      lastSentencePosition: body.lastSentencePosition ?? existing?.lastSentencePosition ?? 1,
      lastPositionMs:
        body.lastPositionMs !== undefined ? body.lastPositionMs : (existing?.lastPositionMs ?? null),
      completionCycleActive:
        body.completionCycleActive ?? existing?.completionCycleActive ?? true,
    })

    return mapListenProgressRow(row)
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.adminRepo.findLesson(lessonId)
    if (!lesson) throw new NotFoundError("Listening lesson")

    const existing = await this.progressRepo.findProgress(userId, lessonId)
    const completionCount =
      existing?.status === "completed"
        ? (existing.completionCount ?? 0) + 1
        : Math.max(1, (existing?.completionCount ?? 0) + 1)

    const row = await this.progressRepo.upsertProgress(userId, lessonId, {
      status: "completed",
      completedSentenceCount: lesson.sentenceCount,
      completionCount,
      completionCycleActive: false,
      completedAt: new Date(),
    })

    return mapListenProgressRow(row)
  }

  async restartLesson(userId: string, lessonId: string) {
    await this.assertLessonExists(lessonId)
    const existing = await this.progressRepo.findProgress(userId, lessonId)

    const row = await this.progressRepo.upsertProgress(userId, lessonId, {
      status: "in_progress",
      completedSentenceCount: 0,
      lastSentencePosition: 1,
      lastPositionMs: null,
      completionCycleActive: true,
      completionCount: existing?.completionCount ?? 0,
      completedAt: null,
    })

    return mapListenProgressRow(row)
  }

  async patchStar(userId: string, lessonId: string, body: StarInput) {
    await this.assertLessonExists(lessonId)
    const existing = await this.progressRepo.findProgress(userId, lessonId)

    const row = await this.progressRepo.upsertProgress(userId, lessonId, {
      status: existing?.status ?? "not_started",
      completedSentenceCount: existing?.completedSentenceCount ?? 0,
      lastSentencePosition: existing?.lastSentencePosition ?? 1,
      isStarred: body.isStarred ?? existing?.isStarred ?? false,
      starCount: body.starCount ?? existing?.starCount ?? 0,
    })

    return mapListenProgressRow(row)
  }

  async mergeGuestProgress(userId: string, body: MergeInput) {
    let merged = 0
    let skipped = 0

    const dictationByLesson = new Map(
      body.dictationEntries.map((entry) => [entry.lessonId, entry]),
    )

    for (const entry of body.lessonEntries) {
      const lesson = await this.adminRepo.findLesson(entry.lessonId)
      if (!lesson || lesson.languageCode !== entry.language) {
        skipped += 1
        continue
      }

      const dictation = dictationByLesson.get(entry.lessonId)
      await this.mergeOneEntry(userId, entry, dictation, lesson.sentenceCount)
      merged += 1
    }

    for (const dictation of body.dictationEntries) {
      if (body.lessonEntries.some((row) => row.lessonId === dictation.lessonId)) continue
      const lesson = await this.adminRepo.findLesson(dictation.lessonId)
      if (!lesson || lesson.languageCode !== dictation.language) {
        skipped += 1
        continue
      }
      await this.mergeOneEntry(
        userId,
        {
          language: dictation.language,
          categorySlug: dictation.categorySlug,
          lessonId: dictation.lessonId,
          sectionId: dictation.sectionId,
          status:
            dictation.correctCount >= lesson.sentenceCount && lesson.sentenceCount > 0
              ? "completed"
              : "in_progress",
        },
        dictation,
        lesson.sentenceCount,
      )
      merged += 1
    }

    let settingsMerged = false
    if (body.playbackSettings) {
      await this.settingsService.mergeListeningPlayback(userId, body.playbackSettings)
      settingsMerged = true
    }

    return { mergedLessons: merged, skipped, settingsMerged }
  }

  private async mergeOneEntry(
    userId: string,
    entry: MergeInput["lessonEntries"][number],
    dictation: MergeInput["dictationEntries"][number] | undefined,
    sentenceCount: number,
  ) {
    const existing = await this.progressRepo.findProgress(userId, entry.lessonId)

    const guestCompleted = entry.status === "completed"
    const guestSentences = dictation
      ? Math.min(sentenceCount, Math.max(0, dictation.correctCount))
      : guestCompleted
        ? sentenceCount
        : 0

    const guestPosition = dictation ? dictation.currentSentenceIndex + 1 : 1

    if (!existing) {
      await this.progressRepo.upsertProgress(userId, entry.lessonId, {
        status: guestCompleted ? "completed" : guestSentences > 0 ? "in_progress" : "not_started",
        completedSentenceCount: guestCompleted ? sentenceCount : guestSentences,
        lastSentencePosition: Math.max(1, guestPosition),
        completedAt: guestCompleted ? new Date() : null,
      })
      return
    }

    const serverCompleted = existing.status === "completed"
    if (serverCompleted) return

    const mergedCompleted = guestCompleted || existing.status === "completed"
    const mergedSentenceCount = Math.max(existing.completedSentenceCount, guestSentences)
    const mergedPosition = Math.max(existing.lastSentencePosition, guestPosition)

    await this.progressRepo.upsertProgress(userId, entry.lessonId, {
      status: mergedCompleted ? "completed" : mergedSentenceCount > 0 ? "in_progress" : existing.status,
      completedSentenceCount: mergedCompleted ? sentenceCount : mergedSentenceCount,
      lastSentencePosition: mergedPosition,
      completedAt: mergedCompleted ? (existing.completedAt ?? new Date()) : existing.completedAt,
    })
  }

  private async assertLessonExists(lessonId: string) {
    const lesson = await this.adminRepo.findLesson(lessonId)
    if (!lesson) throw new NotFoundError("Listening lesson")
  }
}
