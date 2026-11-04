import {
  createVocabLessonPage,
  createVocabLessonPageMetadata,
  createVocabLessonStaticParams,
} from "@/features/vocab/create-vocab-level-routes"

export const generateStaticParams = createVocabLessonStaticParams("jp")
export const generateMetadata = createVocabLessonPageMetadata("jp")
export default createVocabLessonPage("jp")
