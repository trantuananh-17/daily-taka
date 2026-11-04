import {
  createListenLessonPage,
  createListenLessonPageMetadata,
  createListenLessonStaticParams,
} from "@/features/listen/create-listen-lesson-page"

export const generateMetadata = createListenLessonPageMetadata("zh")

export const generateStaticParams = createListenLessonStaticParams("zh")

export default createListenLessonPage("zh")
