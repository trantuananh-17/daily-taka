import type { LanguageHubCode } from "@/lib/learn/hub"

export type FeatureKind = "listening" | "vocab" | "writing"

export type LanguageFeature = {
  id: FeatureKind
  number: string
  href: string
  title: string
  descriptionWide: string
  descriptionMobile: string
  cardClass: string
  accentColor: string
  cardBg: string
}

const FEATURE_BODY: Omit<LanguageFeature, "href">[] = [
  {
    id: "listening",
    number: "01",
    title: "Nghe chép chính tả",
    descriptionWide: "Luyện nghe cả bài hoặc chép chính tả từng câu qua nhiều chủ đề.",
    descriptionMobile: "Lắng nghe, hiểu sâu từng câu.",
    cardClass: "english-feature-listening",
    accentColor: "#2E7D5B",
    cardBg: "#F2F8F4",
  },
  {
    id: "vocab",
    number: "02",
    title: "Học từ vựng",
    descriptionWide: "Học từ theo ngữ cảnh, luyện ghi nhớ và ôn tập theo trình độ.",
    descriptionMobile: "Nhớ từ qua ngữ cảnh.",
    cardClass: "english-feature-vocab",
    accentColor: "#7B68A6",
    cardBg: "#F5F0FA",
  },
  {
    id: "writing",
    number: "03",
    title: "Học viết",
    descriptionWide: "Luyện viết và sắp xếp từng câu để củng cố từ vựng, ngữ pháp.",
    descriptionMobile: "Vững ngữ pháp từng câu.",
    cardClass: "english-feature-writing",
    accentColor: "#B8895A",
    cardBg: "#FEF6EE",
  },
]

const FEATURE_PATH: Record<FeatureKind, string> = {
  listening: "listen",
  vocab: "vocab",
  writing: "write",
}

export function getLanguageFeatures(language: LanguageHubCode): LanguageFeature[] {
  return FEATURE_BODY.map((feature) => ({
    ...feature,
    href: `/${language}/${FEATURE_PATH[feature.id]}`,
  }))
}

/** @deprecated use getLanguageFeatures("en") */
export const ENGLISH_FEATURES = getLanguageFeatures("en")

export type EnglishFeature = LanguageFeature
export type EnglishFeatureArt = FeatureKind
