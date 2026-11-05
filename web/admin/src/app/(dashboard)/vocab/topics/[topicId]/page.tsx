import { VocabTopicLessonsScreen } from "@/features/vocab/components/vocab-topic-lessons-screen"

type PageProps = {
  params: Promise<{ topicId: string }>
}

export default async function VocabTopicLessonsPage({ params }: PageProps) {
  const { topicId } = await params
  return <VocabTopicLessonsScreen topicId={topicId} />
}
