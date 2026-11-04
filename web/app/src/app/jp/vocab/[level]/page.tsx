import {
  createVocabLevelPage,
  createVocabLevelPageMetadata,
  createVocabLevelStaticParams,
} from "@/features/vocab/create-vocab-level-routes"

export const generateStaticParams = createVocabLevelStaticParams("jp")
export const generateMetadata = createVocabLevelPageMetadata("jp")
export default createVocabLevelPage("jp")
