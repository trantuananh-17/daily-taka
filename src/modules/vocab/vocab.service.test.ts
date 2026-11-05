import { describe, expect, it, vi } from "vitest"

import { NotFoundError } from "../../shared/errors"
import { VocabService } from "./vocab.service"
import type { VocabRepository } from "./vocab.repository"

describe("VocabService", () => {
  it("throws when curriculum missing", async () => {
    const repo = {
      findCurriculum: vi.fn().mockResolvedValue(null),
    } as unknown as VocabRepository

    const service = new VocabService(repo)
    await expect(service.getLevelDetail("en", "A1")).rejects.toBeInstanceOf(NotFoundError)
  })
})
