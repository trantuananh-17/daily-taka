import { createListeningSectionCatalog } from "@/lib/learn/listening/mock/listening-section-catalog"

const catalog = createListeningSectionCatalog({
  sectionIdStem: "zh-short-stories",
  lessonIdStem: "lesson-zh-short-stories",
  section1Lessons: [
    { title: "初雪", slug: "first-snow", sentenceCount: 21, level: "HSK1", stars: 4 },
    { title: "杰西卡上学的第一天", sentenceCount: 23, level: "HSK1", stars: 2 },
    { title: "我的花园", sentenceCount: 19, level: "HSK1", stars: 2 },
    { title: "去露营", sentenceCount: 22, level: "HSK1", stars: 0 },
    { title: "我的家", sentenceCount: 20, level: "HSK1", stars: 3 },
    { title: "我的生日派对", sentenceCount: 18, level: "HSK1", stars: 1 },
    { title: "去海滩", sentenceCount: 24, level: "HSK1", stars: 2 },
    { title: "大风暴", sentenceCount: 21, level: "HSK1", stars: 0 },
    { title: "帮妈妈", sentenceCount: 17, level: "HSK1", stars: 4 },
    { title: "失物招领", sentenceCount: 22, level: "HSK1", stars: 1 },
    { title: "新宠物", sentenceCount: 19, level: "HSK1", stars: 3 },
    { title: "学校演出", sentenceCount: 25, level: "HSK1", stars: 2 },
    { title: "寒假", sentenceCount: 20, level: "HSK1", stars: 0 },
    { title: "破窗户", sentenceCount: 23, level: "HSK1", stars: 1 },
    { title: "暑假打工", sentenceCount: 21, level: "HSK1", stars: 2 },
  ],
  levelForGenerated: (sectionNumber, lessonIndex) => {
    if (sectionNumber <= 4) return "HSK1"
    if (sectionNumber <= 9) return "HSK2"
    if (sectionNumber <= 14) return "HSK3"
    return "HSK4"
  },
})

export const buildZhShortStoriesLessons = catalog.buildLessons
export const findZhShortStoriesLesson = catalog.findLesson
export const getZhShortStoriesSectionSummaries = catalog.getSectionSummaries
export const getZhShortStoriesLessonsForSection = catalog.getLessonsForSection
export const getZhShortStoriesSectionTitle = catalog.getSectionTitle
export const getZhShortStoriesAllLessons = catalog.getAllLessons
