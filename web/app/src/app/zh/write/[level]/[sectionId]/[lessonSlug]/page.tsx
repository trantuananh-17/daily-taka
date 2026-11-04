import {
  createWritingLessonPage,
  createWritingLessonPageMetadata,
  createWritingLessonStaticParams,
} from "@/features/writing/create-writing-level-routes"

export const generateStaticParams = createWritingLessonStaticParams("zh")
export const generateMetadata = createWritingLessonPageMetadata("zh")
export default createWritingLessonPage("zh")
