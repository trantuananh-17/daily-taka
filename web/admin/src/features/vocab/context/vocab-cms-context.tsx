"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { contentLanguageLabel, type ContentLanguageCode } from "@/lib/content-language"
import { vocabCmsRootHref } from "@/features/vocab/lib/vocab-cms-hrefs"
import {
  buildInitialVocabWordsMap,
  getVocabLessonsMock,
  getVocabTopicsMock,
  type CreateVocabLessonInput,
  type CreateVocabTopicInput,
  type VocabLessonRow,
  type VocabTopicRow,
  type VocabWordRow,
} from "@/features/vocab/lib/vocab-cms-mock"
import {
  defaultVocabLevel,
  getVocabLevelCodes,
  parseVocabLevelParam,
} from "@/features/vocab/lib/vocab-levels"
import {
  parseVocabLanguageParam,
  readVocabLanguagePreference,
  readVocabLevelPreference,
  writeVocabLanguagePreference,
  writeVocabLevelPreference,
} from "@/features/vocab/lib/vocab-language-preference"

type VocabCmsContextValue = {
  language: ContentLanguageCode
  languageLabel: string
  level: string
  setLanguage: (code: ContentLanguageCode) => void
  setLevel: (level: string) => void
  levelOptions: string[]
  topics: VocabTopicRow[]
  lessons: VocabLessonRow[]
  wordsByLesson: Record<string, VocabWordRow[]>
  findTopic: (id: string) => VocabTopicRow | undefined
  findLesson: (id: string) => VocabLessonRow | undefined
  lessonsForTopic: (topicId: string) => VocabLessonRow[]
  wordsForLesson: (lessonId: string) => VocabWordRow[]
  createTopic: (input: CreateVocabTopicInput) => void
  createLesson: (topicId: string, input: CreateVocabLessonInput) => VocabLessonRow
  updateLesson: (lesson: VocabLessonRow) => void
  saveWords: (lessonId: string, rows: VocabWordRow[]) => void
}

const VocabCmsContext = createContext<VocabCmsContextValue | null>(null)

export function VocabCmsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const langFromUrl = parseVocabLanguageParam(searchParams.get("lang"))
  const language: ContentLanguageCode = langFromUrl ?? readVocabLanguagePreference()
  const languageLabel = contentLanguageLabel(language)
  const levelOptions = getVocabLevelCodes(language)

  const levelFromUrl = parseVocabLevelParam(searchParams.get("level"), language)
  const storedLevel = readVocabLevelPreference(language)
  const level =
    levelFromUrl ??
    (storedLevel && levelOptions.includes(storedLevel) ? storedLevel : defaultVocabLevel(language))

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let changed = false
    if (!langFromUrl) {
      params.set("lang", readVocabLanguagePreference())
      changed = true
    }
    if (!levelFromUrl) {
      const nextLevel =
        storedLevel && levelOptions.includes(storedLevel)
          ? storedLevel
          : defaultVocabLevel(language)
      params.set("level", nextLevel)
      changed = true
    }
    if (changed) {
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [langFromUrl, levelFromUrl, language, levelOptions, pathname, router, searchParams, storedLevel])

  const setLanguage = useCallback(
    (code: ContentLanguageCode) => {
      writeVocabLanguagePreference(code)
      const nextLevel = readVocabLevelPreference(code) ?? defaultVocabLevel(code)
      const params = new URLSearchParams(searchParams.toString())
      params.set("lang", code)
      params.set("level", nextLevel)
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )

  const setLevel = useCallback(
    (next: string) => {
      if (!levelOptions.includes(next)) return
      writeVocabLevelPreference(language, next)
      const params = new URLSearchParams(searchParams.toString())
      params.set("level", next)
      router.replace(`${pathname}?${params.toString()}`)
    },
    [language, levelOptions, pathname, router, searchParams],
  )

  const [topics, setTopics] = useState<VocabTopicRow[]>(() => getVocabTopicsMock("en", "A1"))
  const [lessons, setLessons] = useState(() => getVocabLessonsMock())
  const [wordsByLesson, setWordsByLesson] = useState(buildInitialVocabWordsMap)

  const visibleTopics = useMemo(
    () => topics.filter((t) => t.languageCode === language && t.levelCode === level),
    [topics, language, level],
  )

  const findTopic = useCallback(
    (id: string) => visibleTopics.find((t) => t.id === id),
    [visibleTopics],
  )

  const findLesson = useCallback((id: string) => lessons.find((l) => l.id === id), [lessons])

  const lessonsForTopic = useCallback(
    (topicId: string) =>
      lessons.filter(
        (l) =>
          l.topicId === topicId &&
          l.languageCode === language &&
          l.levelCode === level,
      ),
    [lessons, language, level],
  )

  const wordsForLesson = useCallback(
    (lessonId: string) => wordsByLesson[lessonId] ?? [],
    [wordsByLesson],
  )

  function createTopic(input: CreateVocabTopicInput) {
    const row: VocabTopicRow = {
      id: `topic-${Date.now()}`,
      languageCode: language,
      levelCode: level,
      slug: input.slug,
      title: input.title,
      sortOrder: input.sortOrder,
      lessonCount: 0,
      isPublished: input.isPublished ?? false,
    }
    setTopics((prev) => [...prev, row])
  }

  function createLesson(topicId: string, input: CreateVocabLessonInput): VocabLessonRow {
    const topic = visibleTopics.find((t) => t.id === topicId)
    const row: VocabLessonRow = {
      id: `lesson-${Date.now()}`,
      topicId,
      topicTitle: topic?.title ?? "—",
      languageCode: language,
      levelCode: level,
      slug: input.slug,
      storyId: input.storyId,
      title: input.title,
      description: input.description ?? "",
      wordCount: 0,
      sortOrder: input.sortOrder,
      nextStoryId: null,
      nextStoryTitle: null,
      isPublished: input.isPublished ?? false,
    }
    setLessons((prev) => [...prev, row])
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId && t.languageCode === language && t.levelCode === level
          ? { ...t, lessonCount: t.lessonCount + 1 }
          : t,
      ),
    )
    return row
  }

  function updateLesson(lesson: VocabLessonRow) {
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)))
  }

  function saveWords(lessonId: string, rows: VocabWordRow[]) {
    setWordsByLesson((prev) => ({ ...prev, [lessonId]: rows }))
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, wordCount: rows.length } : l)),
    )
  }

  const value = useMemo<VocabCmsContextValue>(
    () => ({
      language,
      languageLabel,
      level,
      setLanguage,
      setLevel,
      levelOptions,
      topics: visibleTopics,
      lessons,
      wordsByLesson,
      findTopic,
      findLesson,
      lessonsForTopic,
      wordsForLesson,
      createTopic,
      createLesson,
      updateLesson,
      saveWords,
    }),
    [
      language,
      languageLabel,
      level,
      setLanguage,
      setLevel,
      levelOptions,
      visibleTopics,
      lessons,
      wordsByLesson,
      findTopic,
      findLesson,
      lessonsForTopic,
      wordsForLesson,
    ],
  )

  return <VocabCmsContext.Provider value={value}>{children}</VocabCmsContext.Provider>
}

export function useVocabCms() {
  const ctx = useContext(VocabCmsContext)
  if (!ctx) throw new Error("useVocabCms must be used within VocabCmsProvider")
  return ctx
}

export function useVocabCmsGuardRedirect(options: { topicId?: string; lessonId?: string }) {
  const router = useRouter()
  const { language, level, findTopic, findLesson } = useVocabCms()

  const topic = options.topicId ? findTopic(options.topicId) : undefined
  const lesson = options.lessonId ? findLesson(options.lessonId) : undefined

  const invalidTopic = Boolean(options.topicId && !topic)
  const invalidLesson = Boolean(
    options.lessonId && (!lesson || lesson.topicId !== options.topicId),
  )

  useEffect(() => {
    if (invalidTopic || invalidLesson) {
      router.replace(vocabCmsRootHref(language, level))
    }
  }, [invalidLesson, invalidTopic, language, level, router])

  if (invalidTopic || invalidLesson) {
    return { ready: false as const, topic: undefined, lesson: undefined }
  }

  return { ready: true as const, topic, lesson }
}
