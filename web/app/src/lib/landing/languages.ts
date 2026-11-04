import { APP_NAME } from "@/lib/brand"

export type LanguageFlag =
  | { kind: "uk-svg" }
  | { kind: "cn-svg" }
  | { kind: "jp-svg" }

export type LanguageOption = {
  code: "en" | "zh" | "jp"
  codeLabel: string
  href: string
  flag: LanguageFlag
  title: string
  subtitle: string
  glyph: string
  lang: string
  cardTint: string
  accentColor: string
  description: string
}

/** Static mock until language API exists */
export const LANDING_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    codeLabel: "EN",
    href: "/en",
    flag: { kind: "uk-svg" },
    title: "English",
    subtitle: "Tiếng Anh",
    glyph: "Aa",
    lang: "en",
    cardTint: "bg-[#FDF3F1]",
    accentColor: "#DF7059",
    description: `Học tiếng Anh cùng ${APP_NAME}: chọn nghe chép chính tả, từ vựng theo ngữ cảnh hoặc luyện viết từng câu theo trình độ.`,
  },
  {
    code: "zh",
    codeLabel: "CN",
    href: "/zh",
    flag: { kind: "cn-svg" },
    title: "中文",
    subtitle: "Tiếng Trung",
    glyph: "你好",
    lang: "zh",
    cardTint: "bg-[#FEF6EE]",
    accentColor: "#D3A349",
    description: `Học tiếng Trung cùng ${APP_NAME}: chọn nghe chép chính tả, từ vựng theo ngữ cảnh hoặc luyện viết từng câu theo trình độ.`,
  },
  {
    code: "jp",
    codeLabel: "JP",
    href: "/jp",
    flag: { kind: "jp-svg" },
    title: "日本語",
    subtitle: "Tiếng Nhật",
    glyph: "あ",
    lang: "ja",
    cardTint: "bg-[#F2F8F4]",
    accentColor: "#708F82",
    description: `Học tiếng Nhật cùng ${APP_NAME}: chọn nghe chép chính tả, từ vựng theo ngữ cảnh hoặc luyện viết từng câu theo trình độ.`,
  },
]
