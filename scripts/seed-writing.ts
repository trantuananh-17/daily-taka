/**
 * Seed EN A1 — topic Daily Life, lesson 01 (Cooking Breakfast mock).
 * Run: pnpm db:migrate && pnpm db:seed:writing
 */
import "dotenv/config"

import { eq } from "drizzle-orm"

import { db, closeDatabase } from "../src/db/client"
import {
  writingCurricula,
  writingLessons,
  writingSentences,
  writingTopics,
} from "../src/db/schema/writing"
import { LESSON_01_COOKING_BREAKFAST } from "../web/app/src/lib/learn/writing/mock/lessons/lesson-01-cooking-breakfast"

const TOPIC_TITLE = "Daily Life"
const TOPIC_SORT = 1

function slugifyLessonTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function main() {
  const curriculumId = "curriculum-en-writing-a1"
  const topicId = "topic-en-writing-a1-daily-life"
  const cardTitle = `${TOPIC_TITLE} — Bài 01`
  const slug = slugifyLessonTitle(cardTitle)
  const lessonId = "lesson-en-writing-a1-daily-01"
  const story = LESSON_01_COOKING_BREAKFAST

  await db
    .insert(writingCurricula)
    .values({
      id: curriculumId,
      languageCode: "en",
      levelCode: "A1",
      title: "English A1 Writing",
      sortOrder: 1,
      isPublished: true,
    })
    .onConflictDoNothing()

  await db
    .insert(writingTopics)
    .values({
      id: topicId,
      curriculumId,
      slug: "daily-life",
      title: TOPIC_TITLE,
      sortOrder: TOPIC_SORT,
      isPublished: true,
    })
    .onConflictDoUpdate({
      target: writingTopics.id,
      set: { title: TOPIC_TITLE, sortOrder: TOPIC_SORT },
    })

  await db
    .insert(writingLessons)
    .values({
      id: lessonId,
      topicId,
      curriculumId,
      languageCode: "en",
      slug,
      contentId: story.id,
      title: story.title,
      levelCode: "A1",
      sentenceCount: story.sentences.length,
      scriptModes: story.scriptModes ?? null,
      sortOrder: 1,
      isPublished: true,
    })
    .onConflictDoUpdate({
      target: writingLessons.id,
      set: {
        slug,
        title: story.title,
        sentenceCount: story.sentences.length,
      },
    })

  await db.delete(writingSentences).where(eq(writingSentences.lessonId, lessonId))

  for (const [index, sentence] of story.sentences.entries()) {
    const sortOrder = index + 1
    await db.insert(writingSentences).values({
      id: `${lessonId}:s${sortOrder}`,
      lessonId,
      sortOrder,
      promptVi: sentence.vi,
      targetDefault: sentence.target,
      targetsByMode: sentence.targetsByMode ?? {},
      pronunciationKind: sentence.pronunciationKind ?? null,
      pronunciation: sentence.pronunciation ?? [],
    })
  }

  console.log(`Seeded writing ${lessonId} (${story.sentences.length} sentences), slug=${slug}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => closeDatabase())
