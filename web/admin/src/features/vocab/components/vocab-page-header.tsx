"use client"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CONTENT_LANGUAGE_OPTIONS, type ContentLanguageCode } from "@/lib/content-language"

type VocabPageHeaderProps = {
  language: ContentLanguageCode
  languageLabel: string
  level: string
  levelOptions: string[]
  onLanguageChange: (code: ContentLanguageCode) => void
  onLevelChange: (level: string) => void
}

export function VocabPageHeader({
  language,
  languageLabel,
  level,
  levelOptions,
  onLanguageChange,
  onLevelChange,
}: VocabPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-xl font-bold tracking-tight">Vocab CMS</h2>
        <Badge variant="secondary">{languageLabel}</Badge>
        <Badge variant="outline">{level}</Badge>
        <Badge variant="outline">API</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={level} onValueChange={(v) => v && onLevelChange(v)}>
          <SelectTrigger className="w-[120px]" aria-label="Cấp độ">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={language} onValueChange={(v) => onLanguageChange(v as ContentLanguageCode)}>
          <SelectTrigger className="w-[140px]" aria-label="Ngôn ngữ">
            <SelectValue placeholder="Ngôn ngữ" />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_LANGUAGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.code} value={opt.code}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
