import type { WritingLessonRow, WritingSentenceRow } from "../../db/schema/writing"
import type {
  WritingLessonDto,
  WritingLessonSummaryDto,
  WritingSentenceDto,
} from "./writing.types"

export function mapWritingSentenceRow(row: WritingSentenceRow): WritingSentenceDto {
  const dto: WritingSentenceDto = {
    vi: row.promptVi,
    target: row.targetDefault,
  }
  if (row.targetsByMode && Object.keys(row.targetsByMode).length > 0) {
    dto.targetsByMode = row.targetsByMode
  }
  if (row.pronunciationKind) {
    dto.pronunciationKind = row.pronunciationKind as WritingSentenceDto["pronunciationKind"]
  }
  if (row.pronunciation?.length) dto.pronunciation = row.pronunciation
  return dto
}

export function mapWritingLessonSummary(lesson: WritingLessonRow): WritingLessonSummaryDto {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    sentenceCount: lesson.sentenceCount,
    sortOrder: lesson.sortOrder,
  }
}

export function mapWritingLessonDetail(
  lesson: WritingLessonRow,
  sentences: WritingSentenceRow[],
): WritingLessonDto {
  return {
    id: lesson.contentId,
    title: lesson.title,
    level: lesson.levelCode,
    sentences: sentences.map(mapWritingSentenceRow),
    scriptModes: lesson.scriptModes ?? undefined,
    lessonDbId: lesson.id,
    progress: {
      currentSentenceIndex: 0,
      doneSentenceIndexes: [],
      drafts: {},
    },
  }
}
