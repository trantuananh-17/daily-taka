import { ListenLessonDetailScreen } from "@/features/listen/components/listen-lesson-detail-screen"

type PageProps = {
  params: Promise<{ sectionId: string; lessonId: string }>
}

export default async function ListenLessonDetailPage({ params }: PageProps) {
  const { sectionId, lessonId } = await params
  return <ListenLessonDetailScreen sectionId={sectionId} lessonId={lessonId} />
}
