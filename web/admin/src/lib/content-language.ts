export type ContentLanguageCode = "en" | "zh" | "jp"

export const CONTENT_LANGUAGE_OPTIONS: { code: ContentLanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "jp", label: "日本語" },
]

export function contentLanguageLabel(code: ContentLanguageCode): string {
  return CONTENT_LANGUAGE_OPTIONS.find((o) => o.code === code)?.label ?? code
}
