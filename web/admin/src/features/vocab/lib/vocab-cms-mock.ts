import type { ContentLanguageCode } from "@/lib/content-language"

/** Aligns with `vocab_topics` + aggregates. */
export type VocabTopicRow = {
  id: string
  languageCode: ContentLanguageCode
  levelCode: string
  slug: string
  title: string
  sortOrder: number
  lessonCount: number
  isPublished: boolean
}

/** Aligns with `vocab_lessons`. */
export type VocabLessonRow = {
  id: string
  topicId: string
  topicTitle: string
  languageCode: ContentLanguageCode
  levelCode: string
  slug: string
  storyId: string
  title: string
  description: string
  wordCount: number
  sortOrder: number
  nextStoryId: string | null
  nextStoryTitle: string | null
  isPublished: boolean
}

/** Aligns with `vocab_words` + admin PUT body. */
export type VocabWordRow = {
  id: string
  lessonId: string
  slug: string
  term: string
  ipa: string
  partOfSpeech: string
  meaningVi: string
  definition: string
  example: string
  exampleVi: string
  collocations: string[]
  distractors: string[]
  sortOrder: number
}

const TOPICS: VocabTopicRow[] = [
  {
    id: "topic-en-vocab-a1-food-shopping",
    languageCode: "en",
    levelCode: "A1",
    slug: "food-shopping",
    title: "Food & Shopping",
    sortOrder: 3,
    lessonCount: 2,
    isPublished: true,
  },
]

const LESSONS: VocabLessonRow[] = [
  {
    id: "lesson-en-vocab-a1-food-01",
    topicId: "topic-en-vocab-a1-food-shopping",
    topicTitle: "Food & Shopping",
    languageCode: "en",
    levelCode: "A1",
    slug: "food-shopping-bai-01",
    storyId: "lesson-01",
    title: "At the café",
    description: "Basic food and drink vocabulary.",
    wordCount: 2,
    sortOrder: 1,
    nextStoryId: "lesson-02",
    nextStoryTitle: "At the market",
    isPublished: true,
  },
  {
    id: "lesson-en-vocab-a1-food-02",
    topicId: "topic-en-vocab-a1-food-shopping",
    topicTitle: "Food & Shopping",
    languageCode: "en",
    levelCode: "A1",
    slug: "food-shopping-bai-02",
    storyId: "lesson-02",
    title: "At the market",
    description: "Shopping phrases and items.",
    wordCount: 1,
    sortOrder: 2,
    nextStoryId: null,
    nextStoryTitle: null,
    isPublished: false,
  },
]

const WORDS: VocabWordRow[] = [
  {
    id: "lesson-en-vocab-a1-food-01:coffee",
    lessonId: "lesson-en-vocab-a1-food-01",
    slug: "coffee",
    term: "coffee",
    ipa: "/ˈkɒfi/",
    partOfSpeech: "noun",
    meaningVi: "cà phê",
    definition: "a hot drink made from roasted beans",
    example: "I would like a coffee, please.",
    exampleVi: "Cho tôi một ly cà phê.",
    collocations: ["a cup of coffee"],
    distractors: ["tea", "juice"],
    sortOrder: 1,
  },
  {
    id: "lesson-en-vocab-a1-food-01:bread",
    lessonId: "lesson-en-vocab-a1-food-01",
    slug: "bread",
    term: "bread",
    ipa: "/bred/",
    partOfSpeech: "noun",
    meaningVi: "bánh mì",
    definition: "food made from flour and water",
    example: "She bought fresh bread.",
    exampleVi: "Cô ấy mua bánh mì tươi.",
    collocations: [],
    distractors: ["rice", "pasta"],
    sortOrder: 2,
  },
  {
    id: "lesson-en-vocab-a1-food-02:apple",
    lessonId: "lesson-en-vocab-a1-food-02",
    slug: "apple",
    term: "apple",
    ipa: "/ˈæp.əl/",
    partOfSpeech: "noun",
    meaningVi: "quả táo",
    definition: "a round fruit with red or green skin",
    example: "An apple a day keeps the doctor away.",
    exampleVi: "Ăn táo mỗi ngày giúp khỏe mạnh.",
    collocations: ["green apple"],
    distractors: ["orange", "banana"],
    sortOrder: 1,
  },
]

export function getVocabTopicsMock(
  language: ContentLanguageCode,
  levelCode: string,
): VocabTopicRow[] {
  return structuredClone(
    TOPICS.filter((t) => t.languageCode === language && t.levelCode === levelCode),
  )
}

export function getVocabLessonsMock(topicId?: string): VocabLessonRow[] {
  const rows = structuredClone(LESSONS)
  return topicId ? rows.filter((l) => l.topicId === topicId) : rows
}

export function getVocabWordsMock(lessonId: string): VocabWordRow[] {
  return structuredClone(WORDS.filter((w) => w.lessonId === lessonId))
}

export type CreateVocabTopicInput = {
  slug: string
  title: string
  sortOrder: number
  isPublished?: boolean
}

export type CreateVocabLessonInput = {
  slug: string
  storyId: string
  title: string
  description?: string
  sortOrder: number
  isPublished?: boolean
}

export function normalizeVocabWordsForLesson(lessonId: string, rows: VocabWordRow[]): VocabWordRow[] {
  return rows
    .filter((r) => r.term.trim() && r.slug.trim())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r, index) => ({
      ...r,
      lessonId,
      slug: r.slug.trim(),
      term: r.term.trim(),
      sortOrder: index + 1,
      id: r.id || `${lessonId}:${r.slug.trim()}`,
    }))
}

export function createVocabWordRow(lessonId: string, sortOrder: number): VocabWordRow {
  return {
    id: `w-${crypto.randomUUID()}`,
    lessonId,
    slug: "",
    term: "",
    ipa: "",
    partOfSpeech: "noun",
    meaningVi: "",
    definition: "",
    example: "",
    exampleVi: "",
    collocations: [],
    distractors: [],
    sortOrder,
  }
}

export function buildInitialVocabWordsMap(): Record<string, VocabWordRow[]> {
  const map: Record<string, VocabWordRow[]> = {}
  for (const lesson of LESSONS) {
    const rows = WORDS.filter((w) => w.lessonId === lesson.id)
    if (rows.length > 0) map[lesson.id] = structuredClone(rows)
  }
  return map
}
