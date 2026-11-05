"use client"

import { useCallback, useEffect, useState } from "react"

import {
  readTopicsCatalog,
  writeTopicsCatalog,
} from "@/features/topics/lib/topics-catalog"
import type { TopicRow } from "@/features/topics/lib/topics-mock"

export function useTopicsCatalog() {
  const [topics, setTopicsState] = useState<TopicRow[]>([])

  const refresh = useCallback(() => {
    setTopicsState(readTopicsCatalog())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setTopics = useCallback((next: TopicRow[]) => {
    setTopicsState(next)
    writeTopicsCatalog(next)
  }, [])

  return { topics, setTopics, refresh }
}
