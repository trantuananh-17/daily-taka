import { env } from "../../config/env"
import { NotFoundError } from "../../shared/errors"
import type { ListeningLanguageCode } from "./listening.constants"
import { mapCategoryRow, mapLessonDetail, mapLessonRow, mapSectionRow } from "./listening.mapper"
import type { ListeningRepository } from "./listening.repository"
import type {
  DictationLessonDetailDto,
  ListeningCategoryDetailDto,
  ListeningCategoryListDto,
  ListeningLessonDto,
  ListeningLessonSearchDto,
} from "./listening.types"

export class ListeningService {
  constructor(private readonly repo: ListeningRepository) {}

  async assertLanguage(languageCode: ListeningLanguageCode): Promise<void> {
    const ok = await this.repo.languageExists(languageCode)
    if (!ok) throw new NotFoundError("Language")
  }

  async listCategories(languageCode: ListeningLanguageCode): Promise<ListeningCategoryListDto> {
    await this.assertLanguage(languageCode)
    const rows = await this.repo.listCategories(languageCode)
    return {
      next: null,
      rows: rows.map(mapCategoryRow),
      version: "1",
      complete: true,
    }
  }

  async getCategoryDetail(
    languageCode: ListeningLanguageCode,
    categorySlug: string,
  ): Promise<ListeningCategoryDetailDto> {
    await this.assertLanguage(languageCode)
    const category = await this.repo.findCategory(languageCode, categorySlug)
    if (!category) throw new NotFoundError("Listening category")

    const sectionsWithCounts = await this.repo.listSections(category.id)
    return {
      category: mapCategoryRow(category),
      sections: sectionsWithCounts.map(({ section, lessonCount }) => ({
        ...mapSectionRow(section),
        lessonCount,
      })),
    }
  }

  async listSectionLessons(
    languageCode: ListeningLanguageCode,
    categorySlug: string,
    sectionId: string,
    level?: string,
  ): Promise<ListeningLessonDto[]> {
    await this.assertLanguage(languageCode)
    const category = await this.repo.findCategory(languageCode, categorySlug)
    if (!category) throw new NotFoundError("Listening category")

    const sectionRows = await this.repo.listSections(category.id)
    if (!sectionRows.some(({ section }) => section.id === sectionId)) {
      throw new NotFoundError("Listening section")
    }

    const lessons = await this.repo.listLessonsInSection(sectionId, level)
    return lessons.map((lesson) => mapLessonRow(lesson, sectionId))
  }

  async getLessonDetail(
    languageCode: ListeningLanguageCode,
    categorySlug: string,
    sectionId: string,
    lessonSlug: string,
  ): Promise<DictationLessonDetailDto> {
    await this.assertLanguage(languageCode)
    const bundle = await this.repo.findLessonBySlug(
      languageCode,
      categorySlug,
      sectionId,
      lessonSlug,
    )
    if (!bundle) throw new NotFoundError("Listening lesson")

    return mapLessonDetail({
      lesson: bundle.lesson,
      section: bundle.section,
      category: bundle.category,
      sentences: bundle.sentences,
      nextLesson: bundle.nextLesson,
      apiBaseUrl: env.apiBaseUrl,
    })
  }

  async searchLessons(
    languageCode: ListeningLanguageCode,
    categorySlug: string,
    query: string,
    level: string,
  ): Promise<ListeningLessonSearchDto> {
    await this.assertLanguage(languageCode)
    const category = await this.repo.findCategory(languageCode, categorySlug)
    if (!category) throw new NotFoundError("Listening category")

    const hits = await this.repo.searchLessons(category.id, query, level || "all")
    const sectionIds = new Set(hits.map((row) => row.section.id))

    return {
      sectionMatchCount: sectionIds.size,
      hits: hits.map(({ lesson, section }) => ({
        ...mapLessonRow(lesson, section.id),
        sectionTitle: section.title,
      })),
    }
  }
}
