import { ListenCategorySectionsScreen } from "@/features/listen/components/listen-category-sections-screen"

type PageProps = { params: Promise<{ categoryId: string }> }

export default async function ListenCategorySectionsPage({ params }: PageProps) {
  const { categoryId } = await params
  return <ListenCategorySectionsScreen categoryId={categoryId} />
}
