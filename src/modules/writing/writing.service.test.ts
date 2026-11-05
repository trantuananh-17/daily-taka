import { describe, expect, it, vi } from "vitest"

import { NotFoundError } from "../../shared/errors"
import { WritingService } from "./writing.service"
import type { WritingRepository } from "./writing.repository"

describe("WritingService", () => {
  it("throws when curriculum missing", async () => {
    const repo = {
      findCurriculum: vi.fn().mockResolvedValue(null),
    } as unknown as WritingRepository

    const service = new WritingService(repo)
    await expect(service.getLevelDetail("en", "A1")).rejects.toBeInstanceOf(NotFoundError)
  })
})
