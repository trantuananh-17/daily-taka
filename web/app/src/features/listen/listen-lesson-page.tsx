import { ListenLessonClient } from "@/features/listen/listen-lesson-client"
import type { LanguageHubCode } from "@/lib/learn/hub"

type ListenLessonPageProps = {
  language: LanguageHubCode
}

export function ListenLessonPage({ language }: ListenLessonPageProps) {
  return <ListenLessonClient language={language} />
}
