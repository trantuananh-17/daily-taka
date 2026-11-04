import {
  createListenLessonPage,
  createListenLessonPageMetadata,
  createListenLessonStaticParams,
} from "@/features/listen/create-listen-lesson-page"

export const generateMetadata = createListenLessonPageMetadata("en")

export const generateStaticParams = createListenLessonStaticParams("en")

export default createListenLessonPage("en")
