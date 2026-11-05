import { VocabLessonDetailScreen } from "@/features/vocab/components/vocab-lesson-detail-screen"

type PageProps = {
  params: Promise<{ topicId: string; lessonId: string }>
}

export default async function VocabLessonDetailPage({ params }: PageProps) {
  const { topicId, lessonId } = await params
  return <VocabLessonDetailScreen topicId={topicId} lessonId={lessonId} />
}
