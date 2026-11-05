/**
 * Seed EN A1 — topic Food & Shopping, lessons 01–04 from web mock stories.
 * Run: pnpm db:migrate && pnpm db:seed:vocab
 */
import "dotenv/config"

import { eq } from "drizzle-orm"

import { closeDatabase, db } from "../src/db/client"
import { vocabCurricula, vocabLessons, vocabTopics, vocabWords } from "../src/db/schema/vocab"
import { LESSON_01 } from "../web/app/src/lib/learn/vocab/mock/stories/lesson-01"
import { LESSON_02 } from "../web/app/src/lib/learn/vocab/mock/stories/lesson-02"
import { LESSON_03 } from "../web/app/src/lib/learn/vocab/mock/stories/lesson-03"
import { LESSON_04 } from "../web/app/src/lib/learn/vocab/mock/stories/lesson-04"
import type { VocabLessonStory } from "../web/app/src/lib/learn/vocab/types/lesson-story"

const STORIES: VocabLessonStory[] = [LESSON_01, LESSON_02, LESSON_03, LESSON_04]
const TOPIC_TITLE = "Food & Shopping"
const TOPIC_SORT = 3

function slugifyLessonTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function main() {
  const curriculumId = "curriculum-en-a1"
  const topicId = "topic-en-vocab-a1-food-shopping"

  await db
    .insert(vocabCurricula)
    .values({
      id: curriculumId,
      languageCode: "en",
      levelCode: "A1",
      title: "English A1 Vocabulary",
      sortOrder: 1,
      isPublished: true,
    })
    .onConflictDoNothing()

  await db
    .insert(vocabTopics)
    .values({
      id: topicId,
      curriculumId,
      slug: "food-shopping",
      title: TOPIC_TITLE,
      sortOrder: TOPIC_SORT,
      isPublished: true,
    })
    .onConflictDoUpdate({
      target: vocabTopics.id,
      set: { title: TOPIC_TITLE, sortOrder: TOPIC_SORT },
    })

  for (const [index, story] of STORIES.entries()) {
    const lessonIndex = index + 1
    const cardTitle = `${TOPIC_TITLE} — Bài ${String(lessonIndex).padStart(2, "0")}`
    const slug = slugifyLessonTitle(cardTitle)
    const lessonId = `lesson-en-vocab-a1-food-${String(lessonIndex).padStart(2, "0")}`

    await db
      .insert(vocabLessons)
      .values({
        id: lessonId,
        topicId,
        curriculumId,
        languageCode: "en",
        slug,
        storyId: story.id,
        title: story.title,
        description: story.description,
        wordCount: story.words.length,
        sortOrder: lessonIndex,
        nextStoryId: story.nextStory?.id ?? null,
        nextStoryTitle: story.nextStory?.title ?? null,
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: vocabLessons.id,
        set: {
          slug,
          title: story.title,
          description: story.description,
          wordCount: story.words.length,
          nextStoryId: story.nextStory?.id ?? null,
          nextStoryTitle: story.nextStory?.title ?? null,
        },
      })

    await db.delete(vocabWords).where(eq(vocabWords.lessonId, lessonId))
    await db.insert(vocabWords).values(
      story.words.map((word, wordIndex) => ({
        id: `${lessonId}-${word.id}`,
        lessonId,
        slug: word.id,
        term: word.term,
        ipa: word.ipa,
        partOfSpeech: word.partOfSpeech,
        meaningVi: word.meaningVi,
        definition: word.definition,
        example: word.example,
        exampleVi: word.exampleVi,
        collocations: word.collocations,
        distractors: word.distractors,
        sortOrder: wordIndex + 1,
      })),
    )
  }

  console.info("seed-vocab: done (en / A1 / Food & Shopping / 4 lessons)")
  await closeDatabase()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
