import { AppError, NotFoundError } from "../../shared/errors"
import type { ListeningLanguageCode } from "./listening.constants"
import type {
  createCategoryBodySchema,
  createLessonBodySchema,
  createSectionBodySchema,
  updateCategoryBodySchema,
  updateLessonBodySchema,
  updateSectionBodySchema,
  updateSentenceBodySchema,
  upsertSentencesBodySchema,
} from "./listening.admin.dto"
import type { ListeningAdminRepository } from "./listening.admin.repository"
import type { z } from "zod"

type CreateCategoryInput = z.infer<typeof createCategoryBodySchema>
type UpdateCategoryInput = z.infer<typeof updateCategoryBodySchema>
type CreateSectionInput = z.infer<typeof createSectionBodySchema>
type UpdateSectionInput = z.infer<typeof updateSectionBodySchema>
type CreateLessonInput = z.infer<typeof createLessonBodySchema>
type UpdateLessonInput = z.infer<typeof updateLessonBodySchema>
type UpsertSentencesInput = z.infer<typeof upsertSentencesBodySchema>
type UpdateSentenceInput = z.infer<typeof updateSentenceBodySchema>

export class ListeningAdminService {
  constructor(private readonly repo: ListeningAdminRepository) {}

  async createCategory(languageCode: ListeningLanguageCode, body: CreateCategoryInput) {
    const id = body.id ?? `category-${languageCode}-${body.slug}`
    const existing = await this.repo.findCategoryById(id)
    if (existing) {
      throw new AppError("CONFLICT", "Category id already exists.", 409)
    }

    const row = await this.repo.insertCategory({
      id,
      languageCode,
      slug: body.slug,
      name: body.name,
      description: body.description ?? null,
      descriptionVi: body.descriptionVi ?? null,
      sortOrder: body.sortOrder ?? 0,
      lessonCount: body.lessonCount ?? 0,
      levels: body.levels ?? [],
      cover: body.cover ?? null,
      isPublished: body.isPublished ?? true,
    })
    return row
  }

  async updateCategory(
    languageCode: ListeningLanguageCode,
    categoryId: string,
    body: UpdateCategoryInput,
  ) {
    const category = await this.repo.findCategoryById(categoryId)
    if (!category || category.languageCode !== languageCode) {
      throw new NotFoundError("Listening category")
    }

    return this.repo.updateCategory(categoryId, {
      slug: body.slug,
      name: body.name,
      description: body.description,
      descriptionVi: body.descriptionVi,
      sortOrder: body.sortOrder,
      levels: body.levels,
      cover: body.cover,
      isPublished: body.isPublished,
      lessonCount: body.lessonCount,
    })
  }

  async deleteCategory(languageCode: ListeningLanguageCode, categoryId: string) {
    const category = await this.repo.findCategoryById(categoryId)
    if (!category || category.languageCode !== languageCode) {
      throw new NotFoundError("Listening category")
    }
    await this.repo.deleteCategory(categoryId)
  }

  async createSection(
    languageCode: ListeningLanguageCode,
    categoryId: string,
    body: CreateSectionInput,
  ) {
    const category = await this.repo.findCategoryById(categoryId)
    if (!category || category.languageCode !== languageCode) {
      throw new NotFoundError("Listening category")
    }

    const stableId =
      body.id ??
      (categoryId.startsWith("category-")
        ? `section-${categoryId.replace("category-", "")}-${body.sectionNumber}`
        : `section-${categoryId}-${body.sectionNumber}`)

    const row = await this.repo.insertSection({
      id: stableId,
      categoryId,
      sectionNumber: body.sectionNumber,
      title: body.title,
      sortOrder: body.sortOrder ?? body.sectionNumber,
      access: body.access ?? "full",
    })
    return row
  }

  async updateSection(
    languageCode: ListeningLanguageCode,
    sectionId: string,
    body: UpdateSectionInput,
  ) {
    const section = await this.repo.findSection(sectionId)
    if (!section) throw new NotFoundError("Listening section")

    const category = await this.repo.findCategoryById(section.categoryId)
    if (!category || category.languageCode !== languageCode) {
      throw new NotFoundError("Listening section")
    }

    return this.repo.updateSection(sectionId, {
      sectionNumber: body.sectionNumber,
      title: body.title,
      sortOrder: body.sortOrder,
      access: body.access,
    })
  }

  async deleteSection(languageCode: ListeningLanguageCode, sectionId: string) {
    const section = await this.repo.findSection(sectionId)
    if (!section) throw new NotFoundError("Listening section")

    const category = await this.repo.findCategoryById(section.categoryId)
    if (!category || category.languageCode !== languageCode) {
      throw new NotFoundError("Listening section")
    }

    await this.repo.deleteSection(sectionId)
    await this.repo.recomputeCategoryStats(category.id)
  }

  async createLesson(
    languageCode: ListeningLanguageCode,
    sectionId: string,
    body: CreateLessonInput,
  ) {
    const section = await this.repo.findSection(sectionId)
    if (!section) throw new NotFoundError("Listening section")

    const category = await this.repo.findCategoryById(section.categoryId)
    if (!category || category.languageCode !== languageCode) {
      throw new NotFoundError("Listening section")
    }

    const lessonId =
      body.id ??
      `lesson-${sectionId.replace("section-", "")}-${body.displayOrder}`

    const row = await this.repo.insertLesson({
      id: lessonId,
      sectionId,
      categoryId: category.id,
      languageCode,
      slug: body.slug,
      title: body.title,
      levelCode: body.levelCode,
      displayOrder: body.displayOrder,
      sentenceCount: body.sentenceCount ?? 0,
      durationMs: body.durationMs ?? null,
      stars: body.stars ?? 0,
      templateType: body.templateType ?? "audio",
      audioStorageKey: body.audioStorageKey ?? null,
      audioPublicPath: body.audioPublicPath ?? null,
      path: body.path ?? null,
      metadata: body.metadata ?? null,
      dictationGradingDefaults: body.dictationGradingDefaults ?? {
        ignoreCase: true,
        ignorePunctuation: true,
      },
      isPublished: body.isPublished ?? true,
    })

    await this.repo.recomputeCategoryStats(category.id)
    return row
  }

  async updateLesson(
    languageCode: ListeningLanguageCode,
    lessonId: string,
    body: UpdateLessonInput,
  ) {
    const lesson = await this.repo.findLesson(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Listening lesson")
    }

    const row = await this.repo.updateLesson(lessonId, {
      slug: body.slug,
      title: body.title,
      levelCode: body.levelCode,
      displayOrder: body.displayOrder,
      sentenceCount: body.sentenceCount,
      durationMs: body.durationMs,
      stars: body.stars,
      templateType: body.templateType,
      audioStorageKey: body.audioStorageKey,
      audioPublicPath: body.audioPublicPath,
      path: body.path,
      metadata: body.metadata,
      dictationGradingDefaults: body.dictationGradingDefaults,
      isPublished: body.isPublished,
    })

    await this.repo.recomputeCategoryStats(lesson.categoryId)
    return row
  }

  async deleteLesson(languageCode: ListeningLanguageCode, lessonId: string) {
    const lesson = await this.repo.findLesson(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Listening lesson")
    }

    const categoryId = lesson.categoryId
    await this.repo.deleteLesson(lessonId)
    await this.repo.recomputeCategoryStats(categoryId)
  }

  async upsertLessonSentences(
    languageCode: ListeningLanguageCode,
    lessonId: string,
    body: UpsertSentencesInput,
  ) {
    const lesson = await this.repo.findLesson(lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Listening lesson")
    }

    const rows = await this.repo.replaceLessonSentences(lessonId, body.sentences)
    await this.repo.updateLessonSentenceCount(lessonId)
    return rows
  }

  async updateSentence(
    languageCode: ListeningLanguageCode,
    sentenceId: string,
    body: UpdateSentenceInput,
  ) {
    const sentence = await this.repo.findSentence(sentenceId)
    if (!sentence) throw new NotFoundError("Listening sentence")

    const lesson = await this.repo.findLesson(sentence.lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Listening sentence")
    }

    const row = await this.repo.updateSentence(sentenceId, {
      position: body.position,
      startMs: body.startMs,
      endMs: body.endMs,
      transcript: body.transcript,
      metadata: body.metadata,
    })

    if (body.position !== undefined) {
      await this.repo.updateLessonSentenceCount(lesson.id)
    }

    return row
  }

  async deleteSentence(languageCode: ListeningLanguageCode, sentenceId: string) {
    const sentence = await this.repo.findSentence(sentenceId)
    if (!sentence) throw new NotFoundError("Listening sentence")

    const lesson = await this.repo.findLesson(sentence.lessonId)
    if (!lesson || lesson.languageCode !== languageCode) {
      throw new NotFoundError("Listening sentence")
    }

    await this.repo.deleteSentence(sentenceId)
    await this.repo.updateLessonSentenceCount(lesson.id)
  }
}
