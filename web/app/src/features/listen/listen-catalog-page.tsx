import { ListenCatalogClient } from "@/features/listen/listen-catalog-client"
import type { LanguageHubCode } from "@/lib/learn/hub"

type ListenCatalogPageProps = {
  language: LanguageHubCode
}

export function ListenCatalogPage({ language }: ListenCatalogPageProps) {
  return <ListenCatalogClient language={language} />
}
