import {
  createListenLessonPage,
  createListenLessonPageMetadata,
  createListenLessonStaticParams,
} from "@/features/listen/create-listen-lesson-page"

export const metadata = createListenLessonPageMetadata("zh")

export const generateStaticParams = createListenLessonStaticParams("zh")

export default createListenLessonPage("zh")
