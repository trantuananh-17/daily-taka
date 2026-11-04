import { createListeningSectionCatalog } from "@/lib/learn/listening/mock/listening-section-catalog"

const catalog = createListeningSectionCatalog({
  sectionIdStem: "jp-folk-tales",
  lessonIdStem: "lesson-jp-folk-tales",
  section1Lessons: [
    { title: "つるの恩返し", slug: "the-cranes-reward", sentenceCount: 21, level: "N5", stars: 4 },
    { title: "桃太郎", slug: "momotaro", sentenceCount: 23, level: "N5", stars: 2 },
    { title: "かぐや姫", slug: "kaguya-hime", sentenceCount: 19, level: "N5", stars: 2 },
    { title: "ウシとカメ", slug: "the-tortoise-and-the-hare", sentenceCount: 22, level: "N5", stars: 0 },
    { title: "さるかに合戦", slug: "monkey-and-crab", sentenceCount: 20, level: "N5", stars: 3 },
    { title: "花咲きじいさん", slug: "old-man-who-made-trees-bloom", sentenceCount: 18, level: "N5", stars: 1 },
    { title: "浦島太郎", slug: "urashima-taro", sentenceCount: 24, level: "N5", stars: 2 },
    { title: "かさじぞう", slug: "kasa-jizo", sentenceCount: 21, level: "N5", stars: 0 },
    { title: "しょうじょうじのたぬき", slug: "tanuki-of-shojoji", sentenceCount: 17, level: "N5", stars: 4 },
    { title: "金太郎", slug: "kintaro", sentenceCount: 22, level: "N5", stars: 1 },
    { title: "一寸法師", slug: "issun-boshi", sentenceCount: 19, level: "N5", stars: 3 },
    { title: "竹取物語", slug: "taketori-monogatari", sentenceCount: 25, level: "N5", stars: 2 },
    { title: "鶴と亀", slug: "crane-and-tortoise", sentenceCount: 20, level: "N5", stars: 0 },
    { title: "割れしちょう", slug: "broken-butterfly", sentenceCount: 23, level: "N5", stars: 1 },
    { title: "なまずと地震", slug: "catfish-and-earthquake", sentenceCount: 21, level: "N5", stars: 2 },
  ],
  levelForGenerated: (sectionNumber, lessonIndex) => {
    if (sectionNumber <= 4) return "N5"
    if (sectionNumber <= 9) return "N4"
    if (sectionNumber <= 14) return "N3"
    return "N2"
  },
})

export const buildJpFolkTalesLessons = catalog.buildLessons
export const findJpFolkTalesLesson = catalog.findLesson
export const getJpFolkTalesSectionSummaries = catalog.getSectionSummaries
export const getJpFolkTalesLessonsForSection = catalog.getLessonsForSection
export const getJpFolkTalesSectionTitle = catalog.getSectionTitle
export const getJpFolkTalesAllLessons = catalog.getAllLessons
