"use client"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LISTEN_LANGUAGE_OPTIONS,
  type ListenLanguageCode,
} from "@/features/listen/lib/listen-language"

type ListenPageHeaderProps = {
  language: ListenLanguageCode
  languageLabel: string
  onLanguageChange: (code: ListenLanguageCode) => void
}

export function ListenPageHeader({
  language,
  languageLabel,
  onLanguageChange,
}: ListenPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-xl font-bold tracking-tight">Listen CMS</h2>
        <Badge variant="secondary">{languageLabel}</Badge>
        <Badge variant="outline">API</Badge>
      </div>
      <Select
        value={language}
        onValueChange={(v) => onLanguageChange(v as ListenLanguageCode)}
      >
        <SelectTrigger className="w-[140px]" aria-label="Ngôn ngữ">
          <SelectValue placeholder="Ngôn ngữ" />
        </SelectTrigger>
        <SelectContent>
          {LISTEN_LANGUAGE_OPTIONS.map((opt) => (
            <SelectItem key={opt.code} value={opt.code}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
