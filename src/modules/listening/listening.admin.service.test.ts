import { describe, expect, it, vi } from "vitest"

import { AppError } from "../../shared/errors"
import { ListeningAdminService } from "./listening.admin.service"
import type { ListeningAdminRepository } from "./listening.admin.repository"

function createRepo(overrides: Partial<ListeningAdminRepository>): ListeningAdminRepository {
  return {
    findCategoryById: vi.fn().mockResolvedValue(null),
    findCategoryBySlug: vi.fn(),
    insertCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    findSection: vi.fn(),
    insertSection: vi.fn(),
    updateSection: vi.fn(),
    deleteSection: vi.fn(),
    findLesson: vi.fn(),
    insertLesson: vi.fn(),
    updateLesson: vi.fn(),
    deleteLesson: vi.fn(),
    replaceLessonSentences: vi.fn(),
    findSentence: vi.fn(),
    updateSentence: vi.fn(),
    deleteSentence: vi.fn(),
    recomputeCategoryStats: vi.fn(),
    updateLessonSentenceCount: vi.fn(),
    ...overrides,
  } as unknown as ListeningAdminRepository
}

describe("ListeningAdminService", () => {
  it("rejects duplicate category id", async () => {
    const repo = createRepo({
      findCategoryById: vi.fn().mockResolvedValue({ id: "category-en-x" }),
    })
    const service = new ListeningAdminService(repo)
    await expect(
      service.createCategory("en", { slug: "x", name: "X" }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it("builds stable section id from category id", async () => {
    const insertSection = vi.fn().mockResolvedValue({ id: "section-en-short-stories-2" })
    const repo = createRepo({
      findCategoryById: vi.fn().mockResolvedValue({
        id: "category-en-short-stories",
        languageCode: "en",
      }),
      insertSection,
    })
    const service = new ListeningAdminService(repo)
    await service.createSection("en", "category-en-short-stories", {
      sectionNumber: 2,
      title: "Section 2",
    })
    expect(insertSection).toHaveBeenCalledWith(
      expect.objectContaining({ id: "section-en-short-stories-2" }),
    )
  })
})
