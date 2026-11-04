import type {
  ListeningCategoryRow,
  ListeningLessonRow,
  ListeningSectionRow,
  ListeningSentenceRow,
} from "../../db/schema/listening"
import { buildListeningAudioUrl } from "../../storage/listening-audio"
import type {
  DictationLessonDetailDto,
  DictationSentenceDto,
  ListeningCategoryDto,
  ListeningLessonDto,
  ListeningSectionSummaryDto,
} from "./listening.types"

export function resolveLessonAudioUrl(params: {
  lesson: ListeningLessonRow
  apiBaseUrl: string
}): string | undefined {
  const { lesson, apiBaseUrl } = params
  if (lesson.audioStorageKey) {
    return buildListeningAudioUrl(apiBaseUrl, lesson.languageCode, lesson.audioStorageKey)
  }
  if (lesson.audioPublicPath) {
    return lesson.audioPublicPath
  }
  return undefined
}

export function formatSegmentDuration(ms: number): string {
  const sec = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

export function mapCategoryRow(row: ListeningCategoryRow): ListeningCategoryDto {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    levels: row.levels ?? [],
    sort_order: row.sortOrder,
    description: row.description,
    ...(row.descriptionVi ? { descriptionVi: row.descriptionVi } : {}),
    lessonCount: row.lessonCount,
    ...(row.cover ? { cover: row.cover } : {}),
  }
}

export function mapSectionRow(row: ListeningSectionRow): ListeningSectionSummaryDto {
  return {
    id: row.id,
    title: row.title,
    sortOrder: row.sortOrder,
    lessonCount: 0,
    completedCount: 0,
    access: (row.access as ListeningSectionSummaryDto["access"]) ?? "full",
  }
}

export function mapLessonRow(row: ListeningLessonRow, sectionId: string): ListeningLessonDto {
  return {
    id: row.id,
    slug: row.slug,
    sectionId,
    index: row.displayOrder,
    title: row.title,
    sentenceCount: row.sentenceCount,
    level: row.levelCode,
    stars: row.stars,
  }
}

type SentenceMetadata = {
  ipa?: string
  confidence?: number
  properNames?: string[]
  grading?: { ignoreCase?: boolean; ignorePunctuation?: boolean }
}

export function mapSentenceRow(row: ListeningSentenceRow): DictationSentenceDto {
  const meta = (row.metadata ?? {}) as SentenceMetadata
  const segmentMs = row.endMs - row.startMs
  const properNames = meta.properNames ?? []
  return {
    id: row.id,
    index: row.position,
    transcript: row.transcript,
    startMs: row.startMs,
    endMs: row.endMs,
    durationLabel: formatSegmentDuration(segmentMs),
    properNouns: properNames.length > 0 ? properNames : undefined,
    grading: meta.grading,
    metadata: {
      ipa: meta.ipa,
      confidence: meta.confidence,
    },
  }
}

export function mapLessonDetail(params: {
  lesson: ListeningLessonRow
  section: ListeningSectionRow
  category: ListeningCategoryRow
  sentences: ListeningSentenceRow[]
  nextLesson: ListeningLessonRow | null
  apiBaseUrl: string
}): DictationLessonDetailDto {
  const { lesson, section, category, sentences, nextLesson, apiBaseUrl } = params
  const gradingDefaults = (lesson.dictationGradingDefaults ?? {
    ignoreCase: true,
    ignorePunctuation: true,
  }) as { ignoreCase: boolean; ignorePunctuation: boolean }

  return {
    lesson: mapLessonRow(lesson, section.id),
    categorySlug: category.slug,
    categoryName: category.name,
    sectionTitle: section.title,
    audioUrl: resolveLessonAudioUrl({ lesson, apiBaseUrl }),
    durationMs: lesson.durationMs ?? undefined,
    gradingDefaults,
    sentences: sentences.map(mapSentenceRow),
    nextLesson: nextLesson
      ? {
          title: nextLesson.title,
          slug: nextLesson.slug,
          sectionId: nextLesson.sectionId,
          sentenceCount: nextLesson.sentenceCount,
          level: nextLesson.levelCode,
        }
      : null,
  }
}
