import { describe, expect, it, vi } from "vitest"

import { NotFoundError } from "../../shared/errors"
import { ListeningService } from "./listening.service"
import type { ListeningRepository } from "./listening.repository"

function createRepo(overrides: Partial<ListeningRepository>): ListeningRepository {
  return {
    languageExists: vi.fn().mockResolvedValue(true),
    listCategories: vi.fn().mockResolvedValue([]),
    findCategory: vi.fn().mockResolvedValue(null),
    listSections: vi.fn().mockResolvedValue([]),
    listLessonsInSection: vi.fn().mockResolvedValue([]),
    findLessonBySlug: vi.fn().mockResolvedValue(null),
    searchLessons: vi.fn().mockResolvedValue([]),
    ...overrides,
  } as unknown as ListeningRepository
}

describe("ListeningService", () => {
  it("returns category list wrapper", async () => {
    const repo = createRepo({
      listCategories: vi.fn().mockResolvedValue([
        {
          id: "category-en-short-stories",
          languageCode: "en",
          slug: "short-stories",
          name: "Short Stories",
          description: null,
          descriptionVi: "Mô tả",
          sortOrder: 1,
          lessonCount: 15,
          levels: ["A1"],
          cover: null,
          isPublished: true,
        },
      ]),
    })
    const service = new ListeningService(repo)
    const result = await service.listCategories("en")
    expect(result.complete).toBe(true)
    expect(result.rows[0]?.slug).toBe("short-stories")
    expect(result.rows[0]?.descriptionVi).toBe("Mô tả")
  })

  it("throws when category missing", async () => {
    const service = new ListeningService(createRepo({}))
    await expect(service.getCategoryDetail("en", "missing")).rejects.toBeInstanceOf(NotFoundError)
  })
})
