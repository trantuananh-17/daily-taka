import type { VocabLessonRow, VocabWordRow } from "../../db/schema/vocab"
import type { VocabLessonStoryDto, VocabLessonSummaryDto, VocabWordDto } from "./vocab.types"

export function mapVocabWordRow(row: VocabWordRow): VocabWordDto {
  return {
    id: row.slug,
    term: row.term,
    ipa: row.ipa ?? "",
    partOfSpeech: row.partOfSpeech,
    meaningVi: row.meaningVi,
    definition: row.definition,
    example: row.example,
    exampleVi: row.exampleVi,
    collocations: row.collocations ?? [],
    distractors: row.distractors ?? [],
  }
}

export function mapVocabLessonSummary(row: VocabLessonRow): VocabLessonSummaryDto {
  return {
    id: row.storyId,
    slug: row.slug,
    title: row.title,
    description: row.description,
    wordCount: row.wordCount,
    sortOrder: row.sortOrder,
  }
}

export function mapVocabLessonStory(
  lesson: VocabLessonRow,
  words: VocabWordRow[],
  nextLessonDbId?: string | null,
): VocabLessonStoryDto {
  return {
    id: lesson.storyId,
    title: lesson.title,
    description: lesson.description,
    words: words.map(mapVocabWordRow),
    nextStory:
      lesson.nextStoryId && lesson.nextStoryTitle
        ? { id: lesson.nextStoryId, title: lesson.nextStoryTitle }
        : null,
    lessonDbId: lesson.id,
    nextLessonDbId: nextLessonDbId ?? null,
  }
}
