"use client"

import { useMemo, useState } from "react"
import { PlusIcon } from "lucide-react"

import { AdminDataTablePanel } from "@/components/data-table/admin-data-table-panel"
import { Button } from "@/components/ui/button"
import { ListenCreateTopicDialog } from "@/features/listen/components/listen-create-topic-dialog"
import {
  buildTopicsTableColumns,
  TOPICS_TABLE_FILTER,
} from "@/features/topics/components/topics-table-columns"
import type { CreateTopicInput, TopicRow } from "@/features/topics/lib/topics-mock"

type TopicsDataTablePanelProps = {
  topics: TopicRow[]
  onTopicsChange: (topics: TopicRow[]) => void
}

export function TopicsDataTablePanel({ topics, onTopicsChange }: TopicsDataTablePanelProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const columns = useMemo(() => buildTopicsTableColumns(), [])

  function handleCreate(input: CreateTopicInput) {
    const row: TopicRow = {
      id: `mock-${Date.now()}`,
      slug: input.slug,
      name: input.name,
      isPublished: input.isPublished ?? true,
    }
    onTopicsChange([...topics, row])
  }

  return (
    <>
      <AdminDataTablePanel
        title="Topic"
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" aria-hidden />
            Thêm mới
          </Button>
        }
        columns={columns}
        data={topics}
        filter={TOPICS_TABLE_FILTER}
      />

      <ListenCreateTopicDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />
    </>
  )
}
