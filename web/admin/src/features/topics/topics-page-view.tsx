"use client"

import { TopicsPageHeader } from "@/features/topics/components/topics-page-header"
import { TopicsDataTablePanel } from "@/features/topics/components/topics-data-table-panel"
import { useTopicsCatalog } from "@/features/topics/hooks/use-topics-catalog"

export function TopicsPageView() {
  const { topics, setTopics } = useTopicsCatalog()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <TopicsPageHeader />
      <TopicsDataTablePanel topics={topics} onTopicsChange={setTopics} />
    </div>
  )
}
