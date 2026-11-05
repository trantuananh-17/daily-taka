import type { ListenLanguageCode } from "@/features/listen/lib/listen-language"

export type ListenSectionRow = {
  id: string
  topicId: string
  topicName: string
  sortOrder: number
  title: string
  lessonCount: number
  access: "full" | "preview" | "locked"
}

export type ListenLessonRow = {
  id: string
  sectionId: string
  sectionTitle: string
  languageCode: ListenLanguageCode
  slug: string
  title: string
  levelCode: string
  displayOrder: number
  sentenceCount: number
  durationMs: number | null
  stars: number
  templateType: string
  audioPublicPath: string | null
  dictationGradingDefaults: { ignoreCase: boolean; ignorePunctuation: boolean }
  isPublished: boolean
}

export type ListenSentenceRow = {
  id: string
  lessonId: string
  position: number
  startMs: number
  endMs: number
  transcript: string
}

const SECTIONS: ListenSectionRow[] = [
  {
    id: "sec-1",
    topicId: "topic-1",
    topicName: "Short stories",
    sortOrder: 1,
    title: "Fables",
    lessonCount: 2,
    access: "full",
  },
  {
    id: "sec-2",
    topicId: "topic-1",
    topicName: "Short stories",
    sortOrder: 2,
    title: "Modern fiction",
    lessonCount: 1,
    access: "full",
  },
]

const LESSONS: ListenLessonRow[] = [
  {
    id: "les-1",
    sectionId: "sec-1",
    sectionTitle: "Fables",
    languageCode: "en",
    slug: "crow-pitcher",
    title: "The crow and the pitcher",
    levelCode: "A2",
    displayOrder: 1,
    sentenceCount: 3,
    durationMs: 124000,
    stars: 3,
    templateType: "audio",
    audioPublicPath: "/audio/dictation/les-1/full.mp3",
    dictationGradingDefaults: { ignoreCase: true, ignorePunctuation: false },
    isPublished: true,
  },
  {
    id: "les-2",
    sectionId: "sec-1",
    sectionTitle: "Fables",
    languageCode: "en",
    slug: "tortoise-hare",
    title: "The tortoise and the hare",
    levelCode: "B1",
    displayOrder: 2,
    sentenceCount: 2,
    durationMs: 98000,
    stars: 4,
    templateType: "audio",
    audioPublicPath: null,
    dictationGradingDefaults: { ignoreCase: true, ignorePunctuation: true },
    isPublished: false,
  },
  {
    id: "les-3",
    sectionId: "sec-2",
    sectionTitle: "Modern fiction",
    languageCode: "en",
    slug: "late-train-1",
    title: "Late train — part 1",
    levelCode: "B1",
    displayOrder: 1,
    sentenceCount: 0,
    durationMs: null,
    stars: 2,
    templateType: "audio",
    audioPublicPath: null,
    dictationGradingDefaults: { ignoreCase: true, ignorePunctuation: false },
    isPublished: false,
  },
]

const SENTENCES: ListenSentenceRow[] = [
  {
    id: "s-1",
    lessonId: "les-1",
    position: 1,
    startMs: 0,
    endMs: 4200,
    transcript: "A thirsty crow found a pitcher with a little water.",
  },
  {
    id: "s-2",
    lessonId: "les-1",
    position: 2,
    startMs: 4200,
    endMs: 9100,
    transcript: "The neck was too narrow for her beak.",
  },
  {
    id: "s-3",
    lessonId: "les-1",
    position: 3,
    startMs: 9100,
    endMs: 15000,
    transcript: "She dropped pebbles in until she could drink.",
  },
]

export function getListenSectionsMock(): ListenSectionRow[] {
  return structuredClone(SECTIONS)
}

export function getListenLessonsMock(sectionId?: string): ListenLessonRow[] {
  const rows = structuredClone(LESSONS)
  return sectionId ? rows.filter((l) => l.sectionId === sectionId) : rows
}

export function getListenSentencesMock(lessonId: string): ListenSentenceRow[] {
  return structuredClone(SENTENCES.filter((s) => s.lessonId === lessonId))
}

export function findListenLessonMock(id: string): ListenLessonRow | undefined {
  return structuredClone(LESSONS.find((l) => l.id === id))
}

export type CreateListenSectionInput = {
  topicId: string
  sortOrder: number
  title: string
  access?: "full" | "preview" | "locked"
}

export type CreateListenLessonInput = {
  slug: string
  title: string
  levelCode: string
  displayOrder: number
  sentenceCount?: number
  durationMs?: number | null
  stars?: number
  templateType?: string
  audioPublicPath?: string | null
  dictationGradingDefaults?: { ignoreCase: boolean; ignorePunctuation: boolean }
  isPublished?: boolean
}

/** Chuẩn hóa trước khi lưu mock / gọi upsertSentencesBodySchema. */
export function normalizeListenSentencesForLesson(
  lessonId: string,
  rows: ListenSentenceRow[],
): ListenSentenceRow[] {
  return rows
    .filter((r) => r.transcript.trim().length > 0)
    .sort((a, b) => a.position - b.position)
    .map((r, index) => ({
      ...r,
      lessonId,
      position: index + 1,
      transcript: r.transcript.trim(),
      startMs: Math.max(0, Math.floor(r.startMs)),
      endMs: Math.max(0, Math.floor(r.endMs)),
    }))
}

export function deriveLessonDurationMs(sentences: ListenSentenceRow[]): number | null {
  if (sentences.length === 0) return null
  const maxEnd = Math.max(...sentences.map((s) => s.endMs))
  return maxEnd > 0 ? maxEnd : null
}

export function createListenSentenceRow(lessonId: string, position: number): ListenSentenceRow {
  return {
    id: `s-${crypto.randomUUID()}`,
    lessonId,
    position,
    startMs: 0,
    endMs: 0,
    transcript: "",
  }
}

export function buildInitialListenSentencesMap(): Record<string, ListenSentenceRow[]> {
  const map: Record<string, ListenSentenceRow[]> = {}
  for (const lesson of LESSONS) {
    const rows = SENTENCES.filter((s) => s.lessonId === lesson.id)
    if (rows.length > 0) {
      map[lesson.id] = structuredClone(rows)
    }
  }
  return map
}
