export type LanguageHubCode = "en" | "zh" | "jp"

export type LanguageHubMeta = {
  code: LanguageHubCode
  /** Value for data-language on feature cards */
  dataLanguage: string
  breadcrumbLabel: string
  pageTitle: string
  learningPathHref: string
}

export const LANGUAGE_HUBS: Record<LanguageHubCode, LanguageHubMeta> = {
  en: {
    code: "en",
    dataLanguage: "en",
    breadcrumbLabel: "Học tiếng Anh",
    pageTitle: "Học tiếng Anh",
    learningPathHref: "/en/learning-path",
  },
  zh: {
    code: "zh",
    dataLanguage: "zh",
    breadcrumbLabel: "Học tiếng Trung",
    pageTitle: "Học tiếng Trung",
    learningPathHref: "/zh/learning-path",
  },
  jp: {
    code: "jp",
    dataLanguage: "ja",
    breadcrumbLabel: "Học tiếng Nhật",
    pageTitle: "Học tiếng Nhật",
    learningPathHref: "/jp/learning-path",
  },
}
