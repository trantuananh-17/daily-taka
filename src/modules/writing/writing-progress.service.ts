import { NotFoundError } from "../../shared/errors"
import type { z } from "zod"
import type {
  guestWritingMergeBodySchema,
  upsertWritingProgressBodySchema,
} from "./writing-progress.dto"
import { draftsToStorage, mapWritingProgressRow } from "./writing-progress.mapper"
import type { WritingProgressRepository } from "./writing-progress.repository"
import type { WritingLanguageCode } from "./writing.constants"

type UpsertInput = z.infer<typeof upsertWritingProgressBodySchema>
type MergeInput = z.infer<typeof guestWritingMergeBodySchema>

function mergeDoneIndexes(a: number[], b: number[]) {
  return [...new Set([...a, ...b])].sort((x, y) => x - y)
}

function mergeDrafts(
  a: Record<string, string>,
  b: Record<string, string>,
): Record<string, string> {
  return { ...a, ...b }
}

export class WritingProgressService {
  constructor(private readonly repo: WritingProgressRepository) {}

  async getProgress(userId: string, lessonId: string) {
    await this.assertLessonExists(lessonId)
    const row = await this.repo.findProgress(userId, lessonId)
    return row ? mapWritingProgressRow(row) : null
  }

  async upsertProgress(userId: string, lessonId: string, body: UpsertInput) {
    const lesson = await this.assertLessonExists(lessonId)
    const existing = await this.repo.findProgress(userId, lessonId)

    const doneSentenceIndexes =
      body.doneSentenceIndexes ?? existing?.doneSentenceIndexes ?? []
    let status = body.status ?? existing?.status ?? "in_progress"
    if (
      doneSentenceIndexes.length >= lesson.sentenceCount &&
      lesson.sentenceCount > 0
    ) {
      status = "completed"
    }

    const row = await this.repo.upsertProgress(userId, lessonId, {
      status,
      currentSentenceIndex:
        body.currentSentenceIndex ?? existing?.currentSentenceIndex ?? 0,
      doneSentenceIndexes,
      drafts: body.drafts ?? existing?.drafts ?? {},
      scriptModeId:
        body.scriptModeId !== undefined
          ? body.scriptModeId
          : (existing?.scriptModeId ?? null),
      completedAt: status === "completed" ? (existing?.completedAt ?? new Date()) : null,
    })

    return mapWritingProgressRow(row)
  }

  async mergeGuestEntries(userId: string, body: MergeInput) {
    let merged = 0
    let skipped = 0

    for (const entry of body.entries) {
      if (entry.language !== "en") {
        skipped += 1
        continue
      }
      const lesson = await this.repo.findLessonById(entry.lessonId)
      if (!lesson || lesson.languageCode !== entry.language) {
        skipped += 1
        continue
      }

      const existing = await this.repo.findProgress(userId, entry.lessonId)
      const doneSentenceIndexes = mergeDoneIndexes(
        entry.doneSentenceIndexes,
        existing?.doneSentenceIndexes ?? [],
      )
      const status =
        entry.status === "completed" || existing?.status === "completed"
          ? "completed"
          : "in_progress"

      await this.repo.upsertProgress(userId, entry.lessonId, {
        status,
        currentSentenceIndex: Math.max(
          entry.currentSentenceIndex,
          existing?.currentSentenceIndex ?? 0,
        ),
        doneSentenceIndexes,
        drafts: mergeDrafts(entry.drafts ?? {}, existing?.drafts ?? {}),
        scriptModeId: entry.scriptModeId ?? existing?.scriptModeId ?? null,
        completedAt:
          status === "completed" ? (existing?.completedAt ?? new Date()) : null,
      })
      merged += 1
    }

    return { merged, skipped }
  }

  private async assertLessonExists(lessonId: string) {
    const lesson = await this.repo.findLessonById(lessonId)
    if (!lesson) throw new NotFoundError("Writing lesson")
    return lesson
  }

  async levelSectionProgress(
    userId: string,
    _languageCode: WritingLanguageCode,
    topicIds: string[],
  ) {
    return this.repo.countCompletedByTopicIds(userId, topicIds)
  }
}
