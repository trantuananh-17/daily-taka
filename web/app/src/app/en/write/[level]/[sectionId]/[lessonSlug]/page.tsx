import {
  createWritingLessonPage,
  createWritingLessonPageMetadata,
  createWritingLessonStaticParams,
} from "@/features/writing/create-writing-level-routes"

export const generateStaticParams = createWritingLessonStaticParams("en")
export const generateMetadata = createWritingLessonPageMetadata("en")
export default createWritingLessonPage("en")
