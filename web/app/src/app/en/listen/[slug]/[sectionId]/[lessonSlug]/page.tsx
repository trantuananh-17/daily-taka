import {
  createListenLessonPage,
  createListenLessonPageMetadata,
  createListenLessonStaticParams,
} from "@/features/listen/create-listen-lesson-page"

export const metadata = createListenLessonPageMetadata("en")

export const generateStaticParams = createListenLessonStaticParams("en")

export default createListenLessonPage("en")
