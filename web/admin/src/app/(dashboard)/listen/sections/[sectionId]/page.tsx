import { ListenSectionLessonsScreen } from "@/features/listen/components/listen-section-lessons-screen"

type PageProps = {
  params: Promise<{ sectionId: string }>
}

export default async function ListenSectionLessonsPage({ params }: PageProps) {
  const { sectionId } = await params
  return <ListenSectionLessonsScreen sectionId={sectionId} />
}
