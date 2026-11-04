import {
  createListenCategoryPage,
  createListenCategoryPageMetadata,
  createListenCategoryStaticParams,
} from "@/features/listen/create-listen-category-page"

export const generateStaticParams = createListenCategoryStaticParams("en")

export const generateMetadata = createListenCategoryPageMetadata("en")

export default createListenCategoryPage("en")
