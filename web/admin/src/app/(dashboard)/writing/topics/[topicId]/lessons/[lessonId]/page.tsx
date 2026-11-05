import { WritingLessonDetailScreen } from "@/features/writing/components/writing-lesson-detail-screen"

type PageProps = { params: Promise<{ topicId: string; lessonId: string }> }

export default async function WritingLessonDetailPage({ params }: PageProps) {
  const { topicId, lessonId } = await params
  return <WritingLessonDetailScreen topicId={topicId} lessonId={lessonId} />
}
