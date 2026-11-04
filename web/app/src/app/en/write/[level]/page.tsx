import {
  createWritingLevelPage,
  createWritingLevelPageMetadata,
  createWritingLevelStaticParams,
} from "@/features/writing/create-writing-level-routes"

export const generateStaticParams = createWritingLevelStaticParams("en")
export const generateMetadata = createWritingLevelPageMetadata("en")
export default createWritingLevelPage("en")
