import {
  createVocabLessonPage,
  createVocabLessonPageMetadata,
  createVocabLessonStaticParams,
} from "@/features/vocab/create-vocab-level-routes"

export const generateStaticParams = createVocabLessonStaticParams("zh")
export const generateMetadata = createVocabLessonPageMetadata("zh")
export default createVocabLessonPage("zh")
