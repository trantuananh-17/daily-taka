/** Chủ đề dùng chung — không tách theo EN/ZH/JP. */
export type TopicRow = {
  id: string
  slug: string
  name: string
  isPublished: boolean
}

export type CreateTopicInput = {
  slug: string
  name: string
  isPublished?: boolean
}

const MOCK_TOPICS: TopicRow[] = [
  { id: "topic-1", slug: "short-stories", name: "Short stories", isPublished: true },
  { id: "topic-2", slug: "daily-life", name: "Daily life", isPublished: true },
  { id: "topic-3", slug: "news-bites", name: "News bites", isPublished: true },
  { id: "topic-4", slug: "travel", name: "Travel", isPublished: false },
]

export function getTopicsMock(): TopicRow[] {
  return structuredClone(MOCK_TOPICS)
}
