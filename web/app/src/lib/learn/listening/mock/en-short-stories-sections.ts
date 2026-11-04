import { createListeningSectionCatalog } from "@/lib/learn/listening/mock/listening-section-catalog"

const catalog = createListeningSectionCatalog({
  sectionIdStem: "en-short-stories",
  lessonIdStem: "lesson-en-short-stories",
  section1Lessons: [
    { title: "First Snow Fall", sentenceCount: 21, level: "A1", stars: 4 },
    { title: "Jessica's First Day of School", sentenceCount: 23, level: "A1", stars: 2 },
    { title: "My Flower Garden", sentenceCount: 19, level: "A1", stars: 2 },
    { title: "Going Camping", sentenceCount: 22, level: "A1", stars: 0 },
    { title: "My House", sentenceCount: 20, level: "A1", stars: 3 },
    { title: "My Birthday Party", sentenceCount: 18, level: "A1", stars: 1 },
    { title: "A Trip to the Beach", sentenceCount: 24, level: "A1", stars: 2 },
    { title: "The Big Storm", sentenceCount: 21, level: "A1", stars: 0 },
    { title: "Helping Mom", sentenceCount: 17, level: "A1", stars: 4 },
    { title: "Lost and Found", sentenceCount: 22, level: "A1", stars: 1 },
    { title: "A New Pet", sentenceCount: 19, level: "A1", stars: 3 },
    { title: "The School Play", sentenceCount: 25, level: "A1", stars: 2 },
    { title: "Winter Vacation", sentenceCount: 20, level: "A1", stars: 0 },
    { title: "The Broken Window", sentenceCount: 23, level: "A1", stars: 1 },
    { title: "Summer Job", sentenceCount: 21, level: "A1", stars: 2 },
  ],
  levelForGenerated: (sectionNumber) => {
    if (sectionNumber <= 4) return "A1"
    if (sectionNumber <= 9) return "A2"
    if (sectionNumber <= 14) return "B1"
    return "B2"
  },
})

export const buildEnShortStoriesLessons = catalog.buildLessons
export const findEnShortStoriesLesson = catalog.findLesson
export const getEnShortStoriesSectionSummaries = catalog.getSectionSummaries
export const getEnShortStoriesLessonsForSection = catalog.getLessonsForSection
export const getEnShortStoriesSectionTitle = catalog.getSectionTitle
export const getEnShortStoriesAllLessons = catalog.getAllLessons

/** Back-compat alias (old name before tier-1/tier-2 split). */
export const getEnShortStoriesSections = getEnShortStoriesSectionSummaries
