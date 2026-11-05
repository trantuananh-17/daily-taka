import type { ContentLanguageCode } from "@/lib/content-language"

export type WritingTopicRow = {
  id: string
  languageCode: ContentLanguageCode
  levelCode: string
  slug: string
  title: string
  sortOrder: number
  lessonCount: number
  isPublished: boolean
}

export type WritingLessonRow = {
  id: string
  topicId: string
  topicTitle: string
  languageCode: ContentLanguageCode
  levelCode: string
  slug: string
  contentId: string
  title: string
  sentenceCount: number
  sortOrder: number
  scriptModes: { id: string; label: string; inputKind: "latin" | "cjk" }[] | null
  isPublished: boolean
}

export type WritingSentenceRow = {
  id: string
  lessonId: string
  sortOrder: number
  promptVi: string
  targetDefault: string
  targetsByMode: Record<string, string>
  pronunciationKind: string | null
  pronunciation: { word: string; ipa?: string; pinyin?: string; romaji?: string }[]
}

const TOPICS: WritingTopicRow[] = [
  {
    id: "topic-en-writing-a1-daily-life",
    languageCode: "en",
    levelCode: "A1",
    slug: "daily-life",
    title: "Daily Life",
    sortOrder: 1,
    lessonCount: 1,
    isPublished: true,
  },
]

const LESSONS: WritingLessonRow[] = [
  {
    id: "lesson-en-writing-a1-daily-01",
    topicId: "topic-en-writing-a1-daily-life",
    topicTitle: "Daily Life",
    languageCode: "en",
    levelCode: "A1",
    slug: "daily-life-bai-01",
    contentId: "lesson-01-cooking-breakfast",
    title: "Cooking breakfast",
    sentenceCount: 2,
    sortOrder: 1,
    scriptModes: null,
    isPublished: true,
  },
]

const SENTENCES: WritingSentenceRow[] = [
  {
    id: "lesson-en-writing-a1-daily-01:s1",
    lessonId: "lesson-en-writing-a1-daily-01",
    sortOrder: 1,
    promptVi: "Tôi đang nấu bữa sáng.",
    targetDefault: "I am cooking breakfast.",
    targetsByMode: {},
    pronunciationKind: "ipa",
    pronunciation: [
      { word: "I", ipa: "/aɪ/" },
      { word: "breakfast", ipa: "/ˈbrek.fəst/" },
    ],
  },
  {
    id: "lesson-en-writing-a1-daily-01:s2",
    lessonId: "lesson-en-writing-a1-daily-01",
    sortOrder: 2,
    promptVi: "Cô ấy uống cà phê.",
    targetDefault: "She drinks coffee.",
    targetsByMode: {},
    pronunciationKind: "ipa",
    pronunciation: [],
  },
]

export function getWritingTopicsMock(
  language: ContentLanguageCode,
  levelCode: string,
): WritingTopicRow[] {
  return structuredClone(
    TOPICS.filter((t) => t.languageCode === language && t.levelCode === levelCode),
  )
}

export function getWritingLessonsMock(topicId?: string): WritingLessonRow[] {
  const rows = structuredClone(LESSONS)
  return topicId ? rows.filter((l) => l.topicId === topicId) : rows
}

export function getWritingSentencesMock(lessonId: string): WritingSentenceRow[] {
  return structuredClone(SENTENCES.filter((s) => s.lessonId === lessonId))
}

export type CreateWritingTopicInput = {
  slug: string
  title: string
  sortOrder: number
  isPublished?: boolean
}

export type CreateWritingLessonInput = {
  slug: string
  contentId: string
  title: string
  sortOrder: number
  isPublished?: boolean
}

export function normalizeWritingSentencesForLesson(
  lessonId: string,
  rows: WritingSentenceRow[],
): WritingSentenceRow[] {
  return rows
    .filter((r) => r.promptVi.trim() && r.targetDefault.trim())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r, index) => ({
      ...r,
      lessonId,
      sortOrder: index + 1,
      promptVi: r.promptVi.trim(),
      targetDefault: r.targetDefault.trim(),
      id: r.id || `${lessonId}:s${index + 1}`,
    }))
}

export function createWritingSentenceRow(lessonId: string, sortOrder: number): WritingSentenceRow {
  return {
    id: `s-${crypto.randomUUID()}`,
    lessonId,
    sortOrder,
    promptVi: "",
    targetDefault: "",
    targetsByMode: {},
    pronunciationKind: null,
    pronunciation: [],
  }
}

export function buildInitialWritingSentencesMap(): Record<string, WritingSentenceRow[]> {
  const map: Record<string, WritingSentenceRow[]> = {}
  for (const lesson of LESSONS) {
    const rows = SENTENCES.filter((s) => s.lessonId === lesson.id)
    if (rows.length > 0) map[lesson.id] = structuredClone(rows)
  }
  return map
}
