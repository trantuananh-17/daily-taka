import { ListenCategoryClient } from "@/features/listen/listen-category-client"
import type { LanguageHubCode } from "@/lib/learn/hub"

type ListenCategoryPageProps = {
  language: LanguageHubCode
}

export function ListenCategoryPage({ language }: ListenCategoryPageProps) {
  return <ListenCategoryClient language={language} />
}
