import {
  createListenLessonPage,
  createListenLessonPageMetadata,
  createListenLessonStaticParams,
} from "@/features/listen/create-listen-lesson-page"

export const generateMetadata = createListenLessonPageMetadata("jp")

export const generateStaticParams = createListenLessonStaticParams("jp")

export default createListenLessonPage("jp")
