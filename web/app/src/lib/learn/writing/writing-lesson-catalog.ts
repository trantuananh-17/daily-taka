import type { LanguageHubCode } from "@/lib/learn/hub"
import type { CurriculumLesson } from "@/lib/learn/curriculum/types"
import { getWritingLessonById } from "@/lib/learn/writing/mock/lessons"

type WritingCatalogEntry = {
  language: LanguageHubCode
  level: string
  sectionTitle: string
  lessonIndex: number
  lessonContentId: string
}

const WRITING_CATALOG: WritingCatalogEntry[] = [
  {
    language: "en",
    level: "A1",
    sectionTitle: "Daily Life",
    lessonIndex: 1,
    lessonContentId: "lesson-01",
  },
  {
    language: "zh",
    level: "HSK1",
    sectionTitle: "日常生活：入门初探",
    lessonIndex: 1,
    lessonContentId: "lesson-01-zh-hsk1",
  },
  {
    language: "jp",
    level: "N5",
    sectionTitle: "日常生活：基本の学び",
    lessonIndex: 1,
    lessonContentId: "lesson-01-jp-n5",
  },
]

export function applyWritingLessonCatalogOverrides(
  language: LanguageHubCode,
  level: string,
  sectionTitle: string,
  lessons: CurriculumLesson[],
): CurriculumLesson[] {
  return lessons.map((lesson) => {
    const entry = WRITING_CATALOG.find(
      (row) =>
        row.language === language &&
        row.level === level &&
        row.sectionTitle === sectionTitle &&
        row.lessonIndex === lesson.index,
    )
    if (!entry) return lesson

    const mock = getWritingLessonById(entry.lessonContentId)
    if (!mock) return lesson

    return {
      ...lesson,
      itemCount: mock.sentences.length,
    }
  })
}
