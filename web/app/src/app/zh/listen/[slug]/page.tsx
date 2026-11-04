import {
  createListenCategoryPage,
  createListenCategoryPageMetadata,
  createListenCategoryStaticParams,
} from "@/features/listen/create-listen-category-page"

export const generateStaticParams = createListenCategoryStaticParams("zh")

export const generateMetadata = createListenCategoryPageMetadata("zh")

export default createListenCategoryPage("zh")
