import { describe, expect, it, vi } from "vitest"

import { NotFoundError } from "../../shared/errors"
import { VocabProgressService } from "./vocab-progress.service"
import type { VocabProgressRepository } from "./vocab-progress.repository"

describe("VocabProgressService", () => {
  it("throws when lesson missing on getProgress", async () => {
    const repo = {
      findLessonById: vi.fn().mockResolvedValue(null),
    } as unknown as VocabProgressRepository

    const service = new VocabProgressService(repo)
    await expect(service.getProgress("u1", "missing")).rejects.toBeInstanceOf(NotFoundError)
  })
})
