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
  createListeningCategory,
  createListeningLesson,
  createListeningSection,
  fetchListeningCategories,
  fetchCategoryWithSections,
  fetchLessonDetail,
  fetchSectionLessons,
  patchListeningLesson,
  putListeningSentences,
  type ListeningCategory,
  type ListeningLesson,
  type ListeningSection,
  type ListeningSentence,
} from "@/features/listen/lib/listen-admin-api"
import { listenCmsRootHref } from "@/features/listen/lib/listen-cms-hrefs"
import { AdminApiError } from "@/lib/admin-api/client"

type CreateCategoryInput = {
  slug: string
  name: string
  isPublished?: boolean
  levels?: string[]
}

type CreateSectionInput = {
  sectionNumber: number
  title: string
  sortOrder?: number
  access?: "full" | "preview" | "locked"
}

type ListenCmsContextValue = {
  language: ListenLanguageCode
  languageLabel: string
  setLanguage: (code: ListenLanguageCode) => void
  loading: boolean
  error: string | null
  categories: ListeningCategory[]
  refreshCategories: () => Promise<void>
  createCategory: (input: CreateCategoryInput) => Promise<void>
  loadCategorySections: (categoryId: string) => Promise<ListeningSection[]>
  loadSectionLessons: (sectionId: string) => Promise<ListeningLesson[]>
  loadLessonDetail: (lessonId: string) => Promise<{ lesson: ListeningLesson; sentences: ListeningSentence[] }>
  createSection: (categoryId: string, input: CreateSectionInput) => Promise<ListeningSection>
  createLesson: (sectionId: string, input: Record<string, unknown>) => Promise<ListeningLesson>
  updateLesson: (lesson: ListeningLesson) => Promise<void>
  saveSentences: (
    lessonId: string,
    sentences: { position: number; startMs: number; endMs: number; transcript: string }[],
  ) => Promise<void>
  findCategory: (id: string) => ListeningCategory | undefined
}

const ListenCmsContext = createContext<ListenCmsContextValue | null>(null)

function formatApiError(err: unknown): string {
  if (err instanceof AdminApiError) return err.message
  if (err instanceof Error) return err.message
  return "Lỗi không xác định"
}

export function ListenCmsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  const [categories, setCategories] = useState<ListeningCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await fetchListeningCategories(language)
      setCategories(rows)
    } catch (err) {
      setError(formatApiError(err))
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [language])

  const createCategory = useCallback(
    async (input: CreateCategoryInput) => {
      await createListeningCategory(language, {
        slug: input.slug,
        name: input.name,
        isPublished: input.isPublished ?? true,
        levels: input.levels ?? [],
        sortOrder: categories.length,
      })
      await refreshCategories()
    },
    [categories.length, language, refreshCategories],
  )

  const loadCategorySections = useCallback(
    async (categoryId: string) => {
      const data = await fetchCategoryWithSections(language, categoryId)
      return data.sections.map((s) => s.section)
    },
    [language],
  )

  const loadSectionLessons = useCallback(
    async (sectionId: string) => {
      const data = await fetchSectionLessons(language, sectionId)
      return data.lessons
    },
    [language],
  )

  const loadLessonDetail = useCallback(
    async (lessonId: string) => fetchLessonDetail(language, lessonId),
    [language],
  )

  const createSection = useCallback(
    async (categoryId: string, input: CreateSectionInput) =>
      createListeningSection(language, categoryId, input),
    [language],
  )

  const createLesson = useCallback(
    async (sectionId: string, input: Record<string, unknown>) =>
      createListeningLesson(language, sectionId, input),
    [language],
  )

  const updateLesson = useCallback(
    async (lesson: ListeningLesson) => {
      const { id, ...rest } = lesson
      await patchListeningLesson(language, id, {
        slug: rest.slug,
        title: rest.title,
        levelCode: rest.levelCode,
        displayOrder: rest.displayOrder,
        durationMs: rest.durationMs,
        stars: rest.stars,
        audioPublicPath: rest.audioPublicPath,
        dictationGradingDefaults: rest.dictationGradingDefaults ?? undefined,
        isPublished: rest.isPublished,
      })
    },
    [language],
  )

  const saveSentences = useCallback(
    async (
      lessonId: string,
      sentences: { position: number; startMs: number; endMs: number; transcript: string }[],
    ) => {
      if (sentences.length === 0) return
      await putListeningSentences(language, lessonId, sentences)
    },
    [language],
  )

  const findCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories],
  )

  const value = useMemo<ListenCmsContextValue>(
    () => ({
      language,
      languageLabel,
      setLanguage,
      loading,
      error,
      categories,
      refreshCategories,
      createCategory,
      loadCategorySections,
      loadSectionLessons,
      loadLessonDetail,
      createSection,
      createLesson,
      updateLesson,
      saveSentences,
      findCategory,
    }),
    [
      language,
      languageLabel,
      setLanguage,
      loading,
      error,
      categories,
      refreshCategories,
      createCategory,
      loadCategorySections,
      loadSectionLessons,
      loadLessonDetail,
      createSection,
      createLesson,
      updateLesson,
      saveSentences,
      findCategory,
    ],
  )

  return <ListenCmsContext.Provider value={value}>{children}</ListenCmsContext.Provider>
}

export function useListenCms() {
  const ctx = useContext(ListenCmsContext)
  if (!ctx) throw new Error("useListenCms must be used within ListenCmsProvider")
  return ctx
}

export function useListenCmsGuardRedirect(options: {
  categoryId?: string
  sectionId?: string
  lessonId?: string
}) {
  const router = useRouter()
  const { language, findCategory } = useListenCms()
  const category = options.categoryId ? findCategory(options.categoryId) : undefined

  useEffect(() => {
    if (options.categoryId && !category) {
      router.replace(listenCmsRootHref(language))
    }
  }, [category, language, options.categoryId, router])

  if (options.categoryId && !category) {
    return { ready: false as const, category: undefined }
  }

  return { ready: true as const, category }
}
