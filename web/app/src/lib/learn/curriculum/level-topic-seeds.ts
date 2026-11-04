import type { LanguageHubCode } from "@/lib/learn/hub"
import type { CurriculumModule } from "@/lib/learn/curriculum/types"
import type { LevelTopicSeed } from "@/lib/learn/curriculum/build-level-sections"

const ZH_HSK1_TOPICS: LevelTopicSeed[] = [
  { title: "People, Home & Daily Life", lessonCount: 2 },
  { title: "Learning & Communication", lessonCount: 2 },
  { title: "General Nouns & Concepts", lessonCount: 6 },
  { title: "Actions & Processes", lessonCount: 4 },
  { title: "Language Functions", lessonCount: 6 },
  { title: "Mixed Topic Review", lessonCount: 10 },
]

const EN_A1_WRITING_TOPICS: LevelTopicSeed[] = [
  { title: "Daily Life", lessonCount: 12 },
  { title: "Family and Friends", lessonCount: 12 },
  { title: "Food and Drinks", lessonCount: 12 },
  { title: "Home and Living", lessonCount: 12 },
  { title: "Hobbies and Leisure", lessonCount: 12 },
  { title: "Travel and Places", lessonCount: 12 },
  { title: "School and Study", lessonCount: 12 },
  { title: "Work and Jobs", lessonCount: 12 },
  { title: "Health and Body", lessonCount: 12 },
  { title: "Shopping and Money", lessonCount: 12 },
  { title: "Weather and Seasons", lessonCount: 12 },
  { title: "Transportation", lessonCount: 12 },
  { title: "Feelings and Opinions", lessonCount: 12 },
  { title: "Nature and Environment", lessonCount: 12 },
  { title: "Technology", lessonCount: 12 },
  { title: "Culture and Holidays", lessonCount: 12 },
  { title: "Sports and Fitness", lessonCount: 12 },
  { title: "City and Community", lessonCount: 12 },
  { title: "Plans and Future", lessonCount: 12 },
  { title: "Mixed Topic Review", lessonCount: 12 },
]

const EN_A1_VOCAB_TOPICS: LevelTopicSeed[] = [
  { title: "People & Family", lessonCount: 3 },
  { title: "Home & Daily Routines", lessonCount: 3 },
  { title: "Food & Shopping", lessonCount: 4 },
  { title: "Travel & Places", lessonCount: 4 },
  { title: "Work & Study", lessonCount: 4 },
  { title: "Mixed Review", lessonCount: 6 },
]

const JP_N5_VOCAB_TOPICS: LevelTopicSeed[] = [
  { title: "ひらがな・挨拶", lessonCount: 3 },
  { title: "家族・人", lessonCount: 3 },
  { title: "学校・勉強", lessonCount: 4 },
  { title: "食べ物・買い物", lessonCount: 4 },
  { title: "時間・場所", lessonCount: 4 },
  { title: "総復習", lessonCount: 6 },
]

/** Mock writing — một section / một bài để test player ZH. */
const ZH_HSK1_WRITING_TOPICS: LevelTopicSeed[] = [
  { title: "日常生活：入门初探", lessonCount: 1 },
]

/** Mock writing — một section / một bài để test player JP. */
const JP_N5_WRITING_TOPICS: LevelTopicSeed[] = [
  { title: "日常生活：基本の学び", lessonCount: 1 },
]

function genericTopics(level: string): LevelTopicSeed[] {
  return [
    { title: `${level} — Core vocabulary`, lessonCount: 4 },
    { title: `${level} — Daily situations`, lessonCount: 4 },
    { title: `${level} — Communication`, lessonCount: 4 },
    { title: `${level} — Review`, lessonCount: 6 },
  ]
}

type SeedKey = `${LanguageHubCode}:${CurriculumModule}:${string}`

const SEEDS: Partial<Record<SeedKey, LevelTopicSeed[]>> = {
  "zh:vocab:HSK1": ZH_HSK1_TOPICS,
  "en:vocab:A1": EN_A1_VOCAB_TOPICS,
  "jp:vocab:N5": JP_N5_VOCAB_TOPICS,
  "en:writing:A1": EN_A1_WRITING_TOPICS,
  "zh:writing:HSK1": ZH_HSK1_WRITING_TOPICS,
  "jp:writing:N5": JP_N5_WRITING_TOPICS,
}

export function getLevelTopicSeeds(
  language: LanguageHubCode,
  module: CurriculumModule,
  level: string,
): LevelTopicSeed[] {
  const key = `${language}:${module}:${level}` as SeedKey
  return SEEDS[key] ?? genericTopics(level)
}
