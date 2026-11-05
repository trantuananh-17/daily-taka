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

import {
  LISTEN_LANGUAGE_OPTIONS,
  type ListenLanguageCode,
} from "@/features/listen/lib/listen-language"
import {
  parseListenLanguageParam,
  readListenLanguagePreference,
  writeListenLanguagePreference,
} from "@/features/listen/lib/listen-language-preference"
import {
  buildInitialListenSentencesMap,
  deriveLessonDurationMs,
  getListenLessonsMock,
  getListenSectionsMock,
  type CreateListenLessonInput,
  type CreateListenSectionInput,
  type ListenLessonRow,
  type ListenSectionRow,
  type ListenSentenceRow,
} from "@/features/listen/lib/listen-cms-mock"
import { listenCmsRootHref } from "@/features/listen/lib/listen-cms-hrefs"
import { useTopicsCatalog } from "@/features/topics/hooks/use-topics-catalog"

type ListenCmsContextValue = {
  language: ListenLanguageCode
  languageLabel: string
  setLanguage: (code: ListenLanguageCode) => void
  sections: ListenSectionRow[]
  lessons: ListenLessonRow[]
  sentencesByLesson: Record<string, ListenSentenceRow[]>
  topics: ReturnType<typeof useTopicsCatalog>["topics"]
  refreshTopics: () => void
  findSection: (id: string) => ListenSectionRow | undefined
  findLesson: (id: string) => ListenLessonRow | undefined
  lessonsForSection: (sectionId: string) => ListenLessonRow[]
  sentencesForLesson: (lessonId: string) => ListenSentenceRow[]
  createSection: (input: CreateListenSectionInput) => void
  createLesson: (sectionId: string, input: CreateListenLessonInput) => ListenLessonRow
  updateLesson: (lesson: ListenLessonRow) => void
  saveSentences: (lessonId: string, rows: ListenSentenceRow[]) => void
}

const ListenCmsContext = createContext<ListenCmsContextValue | null>(null)

export function ListenCmsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { topics, refresh: refreshTopics } = useTopicsCatalog()

  const langFromUrl = parseListenLanguageParam(searchParams.get("lang"))
  const language: ListenLanguageCode = langFromUrl ?? readListenLanguagePreference()
  const languageLabel =
    LISTEN_LANGUAGE_OPTIONS.find((o) => o.code === language)?.label ?? language

  useEffect(() => {
    if (langFromUrl) {
      writeListenLanguagePreference(langFromUrl)
      return
    }
    const stored = readListenLanguagePreference()
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", stored)
    router.replace(`${pathname}?${params.toString()}`)
  }, [langFromUrl, pathname, router, searchParams])

  const setLanguage = useCallback(
    (code: ListenLanguageCode) => {
      writeListenLanguagePreference(code)
      const params = new URLSearchParams(searchParams.toString())
      params.set("lang", code)
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )

  const [sections, setSections] = useState(() => getListenSectionsMock())
  const [lessons, setLessons] = useState(() => getListenLessonsMock())
  const [sentencesByLesson, setSentencesByLesson] = useState(buildInitialListenSentencesMap)

  const findSection = useCallback(
    (id: string) => sections.find((s) => s.id === id),
    [sections],
  )

  const findLesson = useCallback((id: string) => lessons.find((l) => l.id === id), [lessons])

  const lessonsForSection = useCallback(
    (sectionId: string) =>
      lessons.filter((l) => l.sectionId === sectionId && l.languageCode === language),
    [lessons, language],
  )

  const sentencesForLesson = useCallback(
    (lessonId: string) => sentencesByLesson[lessonId] ?? [],
    [sentencesByLesson],
  )

  function createSection(input: CreateListenSectionInput) {
    const topic = topics.find((t) => t.id === input.topicId)
    const row: ListenSectionRow = {
      id: `sec-${Date.now()}`,
      topicId: input.topicId,
      topicName: topic?.name ?? "—",
      sortOrder: input.sortOrder,
      title: input.title,
      lessonCount: 0,
      access: input.access ?? "full",
    }
    setSections((prev) => [...prev, row])
  }

  function createLesson(sectionId: string, input: CreateListenLessonInput): ListenLessonRow {
    const section = sections.find((s) => s.id === sectionId)
    const row: ListenLessonRow = {
      id: `les-${Date.now()}`,
      sectionId,
      sectionTitle: section?.title ?? "—",
      languageCode: language,
      slug: input.slug,
      title: input.title,
      levelCode: input.levelCode,
      displayOrder: input.displayOrder,
      sentenceCount: 0,
      durationMs: input.durationMs ?? null,
      stars: input.stars ?? 0,
      templateType: input.templateType ?? "audio",
      audioPublicPath: input.audioPublicPath ?? null,
      dictationGradingDefaults: input.dictationGradingDefaults ?? {
        ignoreCase: true,
        ignorePunctuation: false,
      },
      isPublished: input.isPublished ?? false,
    }
    setLessons((prev) => [...prev, row])
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, lessonCount: s.lessonCount + 1 } : s)),
    )
    return row
  }

  function updateLesson(lesson: ListenLessonRow) {
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)))
  }

  function saveSentences(lessonId: string, rows: ListenSentenceRow[]) {
    setSentencesByLesson((prev) => ({ ...prev, [lessonId]: rows }))
    const durationMs = deriveLessonDurationMs(rows)
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? { ...l, sentenceCount: rows.length, durationMs: durationMs ?? l.durationMs }
          : l,
      ),
    )
  }

  const value = useMemo<ListenCmsContextValue>(
    () => ({
      language,
      languageLabel,
      setLanguage,
      sections,
      lessons,
      sentencesByLesson,
      topics,
      refreshTopics,
      findSection,
      findLesson,
      lessonsForSection,
      sentencesForLesson,
      createSection,
      createLesson,
      updateLesson,
      saveSentences,
    }),
    [
      language,
      languageLabel,
      setLanguage,
      sections,
      lessons,
      sentencesByLesson,
      topics,
      refreshTopics,
      findSection,
      findLesson,
      lessonsForSection,
      sentencesForLesson,
    ],
  )

  return <ListenCmsContext.Provider value={value}>{children}</ListenCmsContext.Provider>
}

export function useListenCms() {
  const ctx = useContext(ListenCmsContext)
  if (!ctx) {
    throw new Error("useListenCms must be used within ListenCmsProvider")
  }
  return ctx
}

/** Redirect to /listen when section or lesson id is invalid (mock). */
export function useListenCmsGuardRedirect(options: {
  sectionId?: string
  lessonId?: string
}) {
  const router = useRouter()
  const { language, findSection, findLesson } = useListenCms()

  const section = options.sectionId ? findSection(options.sectionId) : undefined
  const lesson = options.lessonId ? findLesson(options.lessonId) : undefined

  const invalidSection = Boolean(options.sectionId && !section)
  const invalidLesson = Boolean(
    options.lessonId && (!lesson || lesson.sectionId !== options.sectionId),
  )

  useEffect(() => {
    if (invalidSection || invalidLesson) {
      router.replace(listenCmsRootHref(language))
    }
  }, [invalidLesson, invalidSection, language, router])

  if (invalidSection || invalidLesson) {
    return { ready: false as const, section: undefined, lesson: undefined }
  }

  return { ready: true as const, section, lesson }
}
