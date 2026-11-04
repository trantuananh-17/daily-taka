import {
  createVocabLevelPage,
  createVocabLevelPageMetadata,
  createVocabLevelStaticParams,
} from "@/features/vocab/create-vocab-level-routes"

export const generateStaticParams = createVocabLevelStaticParams("zh")
export const generateMetadata = createVocabLevelPageMetadata("zh")
export default createVocabLevelPage("zh")
