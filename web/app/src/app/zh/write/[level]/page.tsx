import {
  createWritingLevelPage,
  createWritingLevelPageMetadata,
  createWritingLevelStaticParams,
} from "@/features/writing/create-writing-level-routes"

export const generateStaticParams = createWritingLevelStaticParams("zh")
export const generateMetadata = createWritingLevelPageMetadata("zh")
export default createWritingLevelPage("zh")
