import {
  createVocabLessonPage,
  createVocabLessonPageMetadata,
  createVocabLessonStaticParams,
} from "@/features/vocab/create-vocab-level-routes"

export const generateStaticParams = createVocabLessonStaticParams("en")
export const generateMetadata = createVocabLessonPageMetadata("en")
export default createVocabLessonPage("en")
