import { WritingTopicLessonsScreen } from "@/features/writing/components/writing-topic-lessons-screen"

type PageProps = { params: Promise<{ topicId: string }> }

export default async function WritingTopicLessonsPage({ params }: PageProps) {
  const { topicId } = await params
  return <WritingTopicLessonsScreen topicId={topicId} />
}
