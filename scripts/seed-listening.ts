/**
 * Seed languages + EN Short Stories section 1 (15 lessons) + sentences for First Snow Fall.
 * Run: pnpm db:migrate && pnpm db:seed
 */
import "dotenv/config"

import { count, eq } from "drizzle-orm"

import { closeDatabase, db } from "../src/db/client"
import { languages } from "../src/db/schema/languages"
import {
  listeningCategories,
  listeningLessons,
  listeningSections,
  listeningSentences,
} from "../src/db/schema/listening"
import { proficiencyLevels } from "../src/db/schema/proficiency-levels"
import { ensureMediaBucket, isStorageConfigured, putObject } from "../src/storage/objects"
import { resolveFirstSnowAudioSourcePath } from "./listening/ensure-first-snow-audio"
import {
  FIRST_SNOW_FALL_SENTENCES,
  FIRST_SNOW_LESSON_ID,
  firstSnowAudioStorageKey,
} from "./listening/first-snow-fall-sentences"
import { readFile } from "node:fs/promises"

const EN_LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const

const SECTION1_LESSONS = [
  { title: "First Snow Fall", slug: "first-snow-fall", sentenceCount: 21, level: "A1", stars: 4 },
  { title: "Jessica's First Day of School", slug: "jessicas-first-day-of-school", sentenceCount: 23, level: "A1", stars: 2 },
  { title: "My Flower Garden", slug: "my-flower-garden", sentenceCount: 19, level: "A1", stars: 2 },
  { title: "Going Camping", slug: "going-camping", sentenceCount: 22, level: "A1", stars: 0 },
  { title: "My House", slug: "my-house", sentenceCount: 20, level: "A1", stars: 3 },
  { title: "My Birthday Party", slug: "my-birthday-party", sentenceCount: 18, level: "A1", stars: 1 },
  { title: "A Trip to the Beach", slug: "a-trip-to-the-beach", sentenceCount: 24, level: "A1", stars: 2 },
  { title: "The Big Storm", slug: "the-big-storm", sentenceCount: 21, level: "A1", stars: 0 },
  { title: "Helping Mom", slug: "helping-mom", sentenceCount: 17, level: "A1", stars: 4 },
  { title: "Lost and Found", slug: "lost-and-found", sentenceCount: 22, level: "A1", stars: 1 },
  { title: "A New Pet", slug: "a-new-pet", sentenceCount: 19, level: "A1", stars: 3 },
  { title: "The School Play", slug: "the-school-play", sentenceCount: 25, level: "A1", stars: 2 },
  { title: "Winter Vacation", slug: "winter-vacation", sentenceCount: 20, level: "A1", stars: 0 },
  { title: "The Broken Window", slug: "the-broken-window", sentenceCount: 23, level: "A1", stars: 1 },
  { title: "Summer Job", slug: "summer-job", sentenceCount: 21, level: "A1", stars: 2 },
] as const

const CATEGORY_COVER = {
  variant: "en",
  topicKey: "short-stories",
  theme: {
    lightBg: "#edf5f0",
    lightWash: "#d4e8dc",
    lightInk: "#2a4538",
    lightAccent: "#7fb396",
    lightSecondary: "#b5c9a8",
    darkBg: "#1f2a24",
    darkWash: "#2e4538",
    darkInk: "#cce8d8",
    darkAccent: "#8fc4a8",
    darkSecondary: "#a8bc9b",
  },
}

const FIRST_SNOW_AUDIO_KEY = firstSnowAudioStorageKey(FIRST_SNOW_LESSON_ID)

async function uploadFirstSnowToMinio(sourcePath: string) {
  if (!isStorageConfigured()) {
    throw new Error(
      "STORAGE_* env missing. Run: docker compose up -d minio — then retry pnpm db:seed",
    )
  }
  await ensureMediaBucket()
  const body = await readFile(sourcePath)
  await putObject(FIRST_SNOW_AUDIO_KEY, body, "audio/mpeg")
  console.info(`seed-listening: uploaded First Snow → MinIO key ${FIRST_SNOW_AUDIO_KEY}`)
}

async function main() {
  const sourcePath = await resolveFirstSnowAudioSourcePath()
  await uploadFirstSnowToMinio(sourcePath)

  await db
    .insert(languages)
    .values([
      { code: "en", name: "English", nativeName: "English", sortOrder: 1 },
      { code: "zh", name: "Chinese", nativeName: "中文", sortOrder: 2 },
      { code: "jp", name: "Japanese", nativeName: "日本語", sortOrder: 3 },
    ])
    .onConflictDoNothing()

  for (const [index, code] of EN_LEVELS.entries()) {
    await db
      .insert(proficiencyLevels)
      .values({
        languageCode: "en",
        code,
        framework: "cefr",
        sortOrder: index + 1,
      })
      .onConflictDoNothing({
        target: [proficiencyLevels.languageCode, proficiencyLevels.code],
      })
  }

  const categoryId = "category-en-short-stories"
  const sectionId = "section-en-short-stories-1"

  await db
    .insert(listeningCategories)
    .values({
      id: categoryId,
      languageCode: "en",
      slug: "short-stories",
      name: "Short Stories",
      description: null,
      descriptionVi: "Luyện nghe qua truyện ngắn, theo dõi nhân vật và diễn biến câu chuyện.",
      sortOrder: 1,
      lessonCount: SECTION1_LESSONS.length,
      levels: [...EN_LEVELS],
      cover: CATEGORY_COVER,
      isPublished: true,
    })
    .onConflictDoUpdate({
      target: listeningCategories.id,
      set: {
        lessonCount: SECTION1_LESSONS.length,
        levels: [...EN_LEVELS],
        descriptionVi:
          "Luyện nghe qua truyện ngắn, theo dõi nhân vật và diễn biến câu chuyện.",
      },
    })

  await db
    .insert(listeningSections)
    .values({
      id: sectionId,
      categoryId,
      sectionNumber: 1,
      title: "Section 1",
      sortOrder: 1,
      access: "preview",
    })
    .onConflictDoNothing()

  for (const [index, lesson] of SECTION1_LESSONS.entries()) {
    const lessonId = `lesson-en-short-stories-1-${index + 1}`
    const isFirstSnow = lesson.slug === "first-snow-fall"

    await db
      .insert(listeningLessons)
      .values({
        id: lessonId,
        sectionId,
        categoryId,
        languageCode: "en",
        slug: lesson.slug,
        title: lesson.title,
        levelCode: lesson.level,
        displayOrder: index + 1,
        sentenceCount: lesson.sentenceCount,
        stars: lesson.stars,
        durationMs: isFirstSnow ? 67_082 : null,
        templateType: "audio",
        audioStorageKey: isFirstSnow ? FIRST_SNOW_AUDIO_KEY : null,
        audioPublicPath: null,
        metadata: isFirstSnow
          ? {
              importMode: "srt",
              lastImportMode: "package_update",
              sourceFilename: "01_First Snow Fall.mp3",
              alignmentProvider: "standard-srt",
              mediaType: "s3_audio",
            }
          : null,
        dictationGradingDefaults: { ignoreCase: true, ignorePunctuation: true },
        path: `/en/listen/short-stories/${sectionId}/${lesson.slug}`,
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: listeningLessons.id,
        set: {
          title: lesson.title,
          sentenceCount: lesson.sentenceCount,
          levelCode: lesson.level,
          stars: lesson.stars,
          ...(isFirstSnow
            ? {
                durationMs: 67_082,
                audioStorageKey: FIRST_SNOW_AUDIO_KEY,
                audioPublicPath: null,
                metadata: {
                  importMode: "srt",
                  lastImportMode: "package_update",
                  sourceFilename: "01_First Snow Fall.mp3",
                  alignmentProvider: "standard-srt",
                  mediaType: "s3_audio",
                },
              }
            : {}),
        },
      })

    if (isFirstSnow) {
      await db.delete(listeningSentences).where(eq(listeningSentences.lessonId, lessonId))
      await db.insert(listeningSentences).values(
        FIRST_SNOW_FALL_SENTENCES.map((row) => ({
          lessonId,
          position: row.position,
          startMs: row.startMs,
          endMs: row.endMs,
          transcript: row.transcript,
          metadata: row.metadata,
        })),
      )
    }
  }

  const [{ value: lessonTotal }] = await db
    .select({ value: count() })
    .from(listeningLessons)
    .where(eq(listeningLessons.categoryId, categoryId))

  await db
    .update(listeningCategories)
    .set({ lessonCount: lessonTotal })
    .where(eq(listeningCategories.id, categoryId))

  console.info("seed-listening: done (en / short-stories / section 1, First Snow 21 sentences + audio)")
  await closeDatabase()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
