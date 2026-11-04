import {
  createWritingLessonPage,
  createWritingLessonPageMetadata,
  createWritingLessonStaticParams,
} from "@/features/writing/create-writing-level-routes"

export const generateStaticParams = createWritingLessonStaticParams("jp")
export const generateMetadata = createWritingLessonPageMetadata("jp")
export default createWritingLessonPage("jp")
