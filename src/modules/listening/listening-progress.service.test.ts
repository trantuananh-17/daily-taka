import { describe, expect, it, vi } from "vitest"

import { ListeningProgressService } from "./listening-progress.service"
import type { ListeningProgressRepository } from "./listening-progress.repository"
import type { ListeningAdminRepository } from "./listening.admin.repository"
import type { UserSettingsService } from "../user-settings/user-settings.service"

function createService(deps: {
  progress: Partial<ListeningProgressRepository>
  admin: Partial<ListeningAdminRepository>
  settings?: Partial<UserSettingsService>
}) {
  return new ListeningProgressService(
    deps.progress as ListeningProgressRepository,
    deps.admin as ListeningAdminRepository,
    (deps.settings ?? { mergeListeningPlayback: vi.fn() }) as UserSettingsService,
  )
}

describe("ListeningProgressService.mergeGuestProgress", () => {
  it("keeps server completed when guest is in_progress", async () => {
    const upsert = vi.fn()
    const findProgress = vi.fn().mockResolvedValue({
      userId: "u1",
      lessonId: "lesson-1",
      status: "completed",
      completedSentenceCount: 21,
      lastSentencePosition: 21,
      completionCount: 1,
      completionCycleActive: false,
      isStarred: false,
      starCount: 0,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPositionMs: null,
    })

    const service = createService({
      progress: { findProgress, upsertProgress: upsert },
      admin: {
        findLesson: vi.fn().mockResolvedValue({
          id: "lesson-1",
          languageCode: "en",
          sentenceCount: 21,
        }),
      },
    })

    const result = await service.mergeGuestProgress("u1", {
      lessonEntries: [
        {
          language: "en",
          categorySlug: "short-stories",
          lessonId: "lesson-1",
          sectionId: "section-1",
          status: "in_progress",
        },
      ],
      dictationEntries: [],
    })

    expect(result.mergedLessons).toBe(1)
    expect(upsert).not.toHaveBeenCalled()
  })
})
