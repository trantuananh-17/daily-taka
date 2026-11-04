import {
  createListenCategoryPage,
  createListenCategoryPageMetadata,
  createListenCategoryStaticParams,
} from "@/features/listen/create-listen-category-page"

export const generateStaticParams = createListenCategoryStaticParams("zh")

export const metadata = createListenCategoryPageMetadata("zh")

export default createListenCategoryPage("zh")
