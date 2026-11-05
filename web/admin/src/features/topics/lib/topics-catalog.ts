import { getTopicsMock, type TopicRow } from "@/features/topics/lib/topics-mock"

const STORAGE_KEY = "dailytaka:admin:topics:v1"

export function readTopicsCatalog(): TopicRow[] {
  if (typeof window === "undefined") {
    return getTopicsMock()
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as TopicRow[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return getTopicsMock()
}

export function writeTopicsCatalog(topics: TopicRow[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
}

export function resetTopicsCatalogToMock(): TopicRow[] {
  const seed = getTopicsMock()
  writeTopicsCatalog(seed)
  return seed
}
