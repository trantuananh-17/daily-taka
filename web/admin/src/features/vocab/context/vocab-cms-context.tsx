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
import type { VocabLessonRow, VocabTopicRow, VocabWordRow } from "@/features/vocab/lib/vocab-cms-mock"
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
import {
  fetchVocabLesson,
  fetchVocabLevelTree,
  patchVocabLesson,
  putVocabWords,
} from "@/features/vocab/lib/vocab-admin-api"
import { AdminApiError } from "@/lib/admin-api/client"

type VocabCmsContextValue = {
  language: ContentLanguageCode
  languageLabel: string
  level: string
  setLanguage: (code: ContentLanguageCode) => void
  setLevel: (level: string) => void
  levelOptions: string[]
  topics: VocabTopicRow[]
  lessons: VocabLessonRow[]
  loading: boolean
  error: string | null
  refreshTree: () => Promise<void>
  findTopic: (id: string) => VocabTopicRow | undefined
  findLesson: (id: string) => VocabLessonRow | undefined
  lessonsForTopic: (topicId: string) => VocabLessonRow[]
  loadLessonWords: (lessonId: string) => Promise<VocabWordRow[]>
  updateLesson: (lesson: VocabLessonRow) => Promise<void>
  saveWords: (lessonId: string, rows: VocabWordRow[]) => Promise<void>
}

const VocabCmsContext = createContext<VocabCmsContextValue | null>(null)

function mapWords(rows: Awaited<ReturnType<typeof fetchVocabLesson>>["words"]): VocabWordRow[] {
  return rows.map((w) => ({
    id: w.id,
    lessonId: w.lessonId,
    slug: w.slug,
    term: w.term,
    ipa: w.ipa ?? "",
    partOfSpeech: w.partOfSpeech,
    meaningVi: w.meaningVi,
    definition: w.definition,
    example: w.example,
    exampleVi: w.exampleVi,
    collocations: w.collocations ?? [],
    distractors: w.distractors ?? [],
    sortOrder: w.sortOrder,
  }))
}

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
    if (changed) router.replace(`${pathname}?${params.toString()}`)
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

  const [topics, setTopics] = useState<VocabTopicRow[]>([])
  const [lessons, setLessons] = useState<VocabLessonRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshTree = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const tree = await fetchVocabLevelTree(language, level)
      const nextTopics: VocabTopicRow[] = []
      const nextLessons: VocabLessonRow[] = []
      for (const block of tree.topics) {
        const t = block.topic
        nextTopics.push({
          id: t.id,
          languageCode: language,
          levelCode: level,
          slug: t.slug,
          title: t.title,
          sortOrder: t.sortOrder,
          lessonCount: block.lessons.length,
          isPublished: t.isPublished,
        })
        for (const summary of block.lessons) {
          nextLessons.push({
            id: summary.id,
            topicId: t.id,
            topicTitle: t.title,
            languageCode: language,
            levelCode: level,
            slug: summary.slug,
            storyId: summary.storyId,
            title: summary.title,
            description: summary.description,
            wordCount: summary.wordCount,
            sortOrder: summary.sortOrder,
            nextStoryId: null,
            nextStoryTitle: null,
            isPublished: summary.isPublished,
          })
        }
      }
      setTopics(nextTopics)
      setLessons(nextLessons)
    } catch (err) {
      setTopics([])
      setLessons([])
      setError(err instanceof AdminApiError ? err.message : "Không tải được vocab tree")
    } finally {
      setLoading(false)
    }
  }, [language, level])

  useEffect(() => {
    void refreshTree()
  }, [refreshTree])

  const findTopic = useCallback((id: string) => topics.find((t) => t.id === id), [topics])
  const findLesson = useCallback((id: string) => lessons.find((l) => l.id === id), [lessons])
  const lessonsForTopic = useCallback(
    (topicId: string) => lessons.filter((l) => l.topicId === topicId),
    [lessons],
  )

  const loadLessonWords = useCallback(
    async (lessonId: string) => {
      const data = await fetchVocabLesson(language, lessonId)
      const lesson = data.lesson
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId
            ? {
                ...l,
                slug: lesson.slug,
                storyId: lesson.storyId,
                title: lesson.title,
                description: lesson.description,
                wordCount: lesson.wordCount,
                sortOrder: lesson.sortOrder,
                nextStoryId: lesson.nextStoryId,
                nextStoryTitle: lesson.nextStoryTitle,
                isPublished: lesson.isPublished,
              }
            : l,
        ),
      )
      return mapWords(data.words)
    },
    [language],
  )

  const updateLesson = useCallback(
    async (lesson: VocabLessonRow) => {
      await patchVocabLesson(language, lesson.id, {
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        storyId: lesson.storyId,
        sortOrder: lesson.sortOrder,
        nextStoryId: lesson.nextStoryId,
        nextStoryTitle: lesson.nextStoryTitle,
        isPublished: lesson.isPublished,
      })
      setLessons((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)))
    },
    [language],
  )

  const saveWords = useCallback(
    async (lessonId: string, rows: VocabWordRow[]) => {
      await putVocabWords(
        language,
        lessonId,
        rows.map((w) => ({
          id: w.id,
          slug: w.slug,
          term: w.term,
          ipa: w.ipa,
          partOfSpeech: w.partOfSpeech,
          meaningVi: w.meaningVi,
          definition: w.definition,
          example: w.example,
          exampleVi: w.exampleVi,
          collocations: w.collocations,
          distractors: w.distractors,
          sortOrder: w.sortOrder,
        })),
      )
    },
    [language],
  )

  const value = useMemo<VocabCmsContextValue>(
    () => ({
      language,
      languageLabel,
      level,
      setLanguage,
      setLevel,
      levelOptions,
      topics,
      lessons,
      loading,
      error,
      refreshTree,
      findTopic,
      findLesson,
      lessonsForTopic,
      loadLessonWords,
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
      topics,
      lessons,
      loading,
      error,
      refreshTree,
      findTopic,
      findLesson,
      lessonsForTopic,
      loadLessonWords,
      updateLesson,
      saveWords,
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
