import {
  createVocabLevelPage,
  createVocabLevelPageMetadata,
  createVocabLevelStaticParams,
} from "@/features/vocab/create-vocab-level-routes"

export const generateStaticParams = createVocabLevelStaticParams("en")
export const generateMetadata = createVocabLevelPageMetadata("en")
export default createVocabLevelPage("en")
