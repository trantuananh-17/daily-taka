import {
  createWritingLevelPage,
  createWritingLevelPageMetadata,
  createWritingLevelStaticParams,
} from "@/features/writing/create-writing-level-routes"

export const generateStaticParams = createWritingLevelStaticParams("jp")
export const generateMetadata = createWritingLevelPageMetadata("jp")
export default createWritingLevelPage("jp")
