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
import { writingCmsRootHref } from "@/features/writing/lib/writing-cms-hrefs"
import {
  buildInitialWritingSentencesMap,
  getWritingLessonsMock,
  getWritingTopicsMock,
  type CreateWritingLessonInput,
  type CreateWritingTopicInput,
  type WritingLessonRow,
  type WritingSentenceRow,
  type WritingTopicRow,
} from "@/features/writing/lib/writing-cms-mock"
import {
  defaultWritingLevel,
  getWritingLevelCodes,
  parseWritingLevelParam,
} from "@/features/writing/lib/writing-levels"
import {
  parseWritingLanguageParam,
  readWritingLanguagePreference,
  readWritingLevelPreference,
  writeWritingLanguagePreference,
  writeWritingLevelPreference,
} from "@/features/writing/lib/writing-language-preference"

type WritingCmsContextValue = {
  language: ContentLanguageCode
  languageLabel: string
  level: string
  setLanguage: (code: ContentLanguageCode) => void
  setLevel: (level: string) => void
  levelOptions: string[]
  topics: WritingTopicRow[]
  lessons: WritingLessonRow[]
  sentencesByLesson: Record<string, WritingSentenceRow[]>
  findTopic: (id: string) => WritingTopicRow | undefined
  findLesson: (id: string) => WritingLessonRow | undefined
  lessonsForTopic: (topicId: string) => WritingLessonRow[]
  sentencesForLesson: (lessonId: string) => WritingSentenceRow[]
  createTopic: (input: CreateWritingTopicInput) => void
  createLesson: (topicId: string, input: CreateWritingLessonInput) => WritingLessonRow
  updateLesson: (lesson: WritingLessonRow) => void
  saveSentences: (lessonId: string, rows: WritingSentenceRow[]) => void
}

const WritingCmsContext = createContext<WritingCmsContextValue | null>(null)

export function WritingCmsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const langFromUrl = parseWritingLanguageParam(searchParams.get("lang"))
  const language: ContentLanguageCode = langFromUrl ?? readWritingLanguagePreference()
  const languageLabel = contentLanguageLabel(language)
  const levelOptions = getWritingLevelCodes(language)

  const levelFromUrl = parseWritingLevelParam(searchParams.get("level"), language)
  const storedLevel = readWritingLevelPreference(language)
  const level =
    levelFromUrl ??
    (storedLevel && levelOptions.includes(storedLevel) ? storedLevel : defaultWritingLevel(language))

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let changed = false
    if (!langFromUrl) {
      params.set("lang", readWritingLanguagePreference())
      changed = true
    }
    if (!levelFromUrl) {
      const nextLevel =
        storedLevel && levelOptions.includes(storedLevel)
          ? storedLevel
          : defaultWritingLevel(language)
      params.set("level", nextLevel)
      changed = true
    }
    if (changed) router.replace(`${pathname}?${params.toString()}`)
  }, [langFromUrl, levelFromUrl, language, levelOptions, pathname, router, searchParams, storedLevel])

  const setLanguage = useCallback(
    (code: ContentLanguageCode) => {
      writeWritingLanguagePreference(code)
      const nextLevel = readWritingLevelPreference(code) ?? defaultWritingLevel(code)
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
      writeWritingLevelPreference(language, next)
      const params = new URLSearchParams(searchParams.toString())
      params.set("level", next)
      router.replace(`${pathname}?${params.toString()}`)
    },
    [language, levelOptions, pathname, router, searchParams],
  )

  const [topics, setTopics] = useState<WritingTopicRow[]>(() => getWritingTopicsMock("en", "A1"))
  const [lessons, setLessons] = useState(() => getWritingLessonsMock())
  const [sentencesByLesson, setSentencesByLesson] = useState(buildInitialWritingSentencesMap)

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
          l.topicId === topicId && l.languageCode === language && l.levelCode === level,
      ),
    [lessons, language, level],
  )

  const sentencesForLesson = useCallback(
    (lessonId: string) => sentencesByLesson[lessonId] ?? [],
    [sentencesByLesson],
  )

  function createTopic(input: CreateWritingTopicInput) {
    const row: WritingTopicRow = {
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

  function createLesson(topicId: string, input: CreateWritingLessonInput): WritingLessonRow {
    const topic = visibleTopics.find((t) => t.id === topicId)
    const row: WritingLessonRow = {
      id: `lesson-${Date.now()}`,
      topicId,
      topicTitle: topic?.title ?? "—",
      languageCode: language,
      levelCode: level,
      slug: input.slug,
      contentId: input.contentId,
      title: input.title,
      sentenceCount: 0,
      sortOrder: input.sortOrder,
      scriptModes: null,
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

  function updateLesson(lesson: WritingLessonRow) {
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)))
  }

  function saveSentences(lessonId: string, rows: WritingSentenceRow[]) {
    setSentencesByLesson((prev) => ({ ...prev, [lessonId]: rows }))
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, sentenceCount: rows.length } : l)),
    )
  }

  const value = useMemo<WritingCmsContextValue>(
    () => ({
      language,
      languageLabel,
      level,
      setLanguage,
      setLevel,
      levelOptions,
      topics: visibleTopics,
      lessons,
      sentencesByLesson,
      findTopic,
      findLesson,
      lessonsForTopic,
      sentencesForLesson,
      createTopic,
      createLesson,
      updateLesson,
      saveSentences,
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
      sentencesByLesson,
      findTopic,
      findLesson,
      lessonsForTopic,
      sentencesForLesson,
    ],
  )

  return <WritingCmsContext.Provider value={value}>{children}</WritingCmsContext.Provider>
}

export function useWritingCms() {
  const ctx = useContext(WritingCmsContext)
  if (!ctx) throw new Error("useWritingCms must be used within WritingCmsProvider")
  return ctx
}

export function useWritingCmsGuardRedirect(options: { topicId?: string; lessonId?: string }) {
  const router = useRouter()
  const { language, level, findTopic, findLesson } = useWritingCms()

  const topic = options.topicId ? findTopic(options.topicId) : undefined
  const lesson = options.lessonId ? findLesson(options.lessonId) : undefined

  const invalidTopic = Boolean(options.topicId && !topic)
  const invalidLesson = Boolean(
    options.lessonId && (!lesson || lesson.topicId !== options.topicId),
  )

  useEffect(() => {
    if (invalidTopic || invalidLesson) {
      router.replace(writingCmsRootHref(language, level))
    }
  }, [invalidLesson, invalidTopic, language, level, router])

  if (invalidTopic || invalidLesson) {
    return { ready: false as const, topic: undefined, lesson: undefined }
  }

  return { ready: true as const, topic, lesson }
}
