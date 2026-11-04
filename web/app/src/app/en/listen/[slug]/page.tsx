import {
  createListenCategoryPage,
  createListenCategoryPageMetadata,
  createListenCategoryStaticParams,
} from "@/features/listen/create-listen-category-page"

export const generateStaticParams = createListenCategoryStaticParams("en")

export const metadata = createListenCategoryPageMetadata("en")

export default createListenCategoryPage("en")
