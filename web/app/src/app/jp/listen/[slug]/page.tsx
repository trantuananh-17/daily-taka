import {
  createListenCategoryPage,
  createListenCategoryPageMetadata,
  createListenCategoryStaticParams,
} from "@/features/listen/create-listen-category-page"

export const generateStaticParams = createListenCategoryStaticParams("jp")

export const generateMetadata = createListenCategoryPageMetadata("jp")

export default createListenCategoryPage("jp")
