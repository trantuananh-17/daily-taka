import { Hono } from "hono"
import { z } from "zod"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { requireUserAuth } from "../../auth/require-user-auth"
import { userVocabWeakItems, vocabWords } from "../../db/schema/vocab"
import { and, eq, or } from "drizzle-orm"
import { mapVocabWordRow } from "./vocab.mapper"
import {
  clearVocabWeakWordBodySchema,
  guestVocabMergeBodySchema,
  upsertVocabProgressBodySchema,
} from "./vocab-progress.dto"
import { VocabProgressRepository } from "./vocab-progress.repository"
import { VocabProgressService } from "./vocab-progress.service"

const upsertWeakBodySchema = z.object({
  wordId: z.string().min(1),
  lessonId: z.string().min(1),
  weakSource: z.enum([
    "flashcard_again",
    "matching_wrong",
    "main_quiz_wrong",
    "carried_from_lesson",
  ]),
  reviewFlashcardRequired: z.boolean(),
  targetLessonId: z.string().optional(),
})

const carryBodySchema = z.object({
  sourceLessonId: z.string().min(1),
  items: z.array(
    z.object({
      wordId: z.string().min(1),
      reviewFlashcardRequired: z.boolean().optional(),
    }),
  ),
})

function createProgressService() {
  return new VocabProgressService(new VocabProgressRepository(db))
}

async function resolveLessonDbId(languageCode: string, idOrStoryId: string) {
  const repo = new VocabProgressRepository(db)
  if (idOrStoryId.includes("-vocab-")) {
    const lesson = await repo.findLessonById(idOrStoryId)
    if (lesson && lesson.languageCode === languageCode) return lesson.id
  }
  return repo.findLessonIdByStoryId(languageCode, idOrStoryId)
}

async function replaceCarryRows(
  userId: string,
  targetLessonId: string,
  sourceLessonId: string,
  items: Array<{ wordId: string; reviewFlashcardRequired?: boolean }>,
) {
  const now = new Date().toISOString()

  await db
    .delete(userVocabWeakItems)
    .where(
      and(
        eq(userVocabWeakItems.userId, userId),
        eq(userVocabWeakItems.targetLessonId, targetLessonId),
        eq(userVocabWeakItems.status, "carried"),
        eq(userVocabWeakItems.lessonId, sourceLessonId),
      ),
    )

  for (const row of items) {
    const wordRows = await db
      .select()
      .from(vocabWords)
      .where(
        and(eq(vocabWords.lessonId, sourceLessonId), eq(vocabWords.slug, row.wordId)),
      )
      .limit(1)
    const word = wordRows[0]
    if (!word) continue

    const id = `${userId}:${word.id}:carry:${targetLessonId}`
    await db.insert(userVocabWeakItems).values({
      id,
      userId,
      vocabularyWordId: word.id,
      lessonId: sourceLessonId,
      targetLessonId,
      weakSource: "carried_from_lesson",
      reviewFlashcardRequired: row.reviewFlashcardRequired ?? true,
      status: "carried",
      createdAt: now,
    })
  }
}

export function createVocabUserRoutes() {
  const app = new Hono<AppEnv>()
  app.use("*", requireUserAuth())

  app.get("/lessons/:lessonId/progress", async (c) => {
    const userId = c.get("userId")!
    const progress = await createProgressService().getProgress(userId, c.req.param("lessonId"))
    return c.json({ progress })
  })

  app.put("/lessons/:lessonId/progress", async (c) => {
    const userId = c.get("userId")!
    const body = upsertVocabProgressBodySchema.parse(await c.req.json())
    const progress = await createProgressService().upsertProgress(
      userId,
      c.req.param("lessonId"),
      body,
    )
    return c.json({ progress })
  })

  app.post("/lessons/:lessonId/complete", async (c) => {
    const userId = c.get("userId")!
    const parsed = z.object({ masteredCount: z.number().int().min(0).optional() }).parse(
      await c.req.json().catch(() => ({})),
    )
    const progress = await createProgressService().completeLesson(
      userId,
      c.req.param("lessonId"),
      parsed.masteredCount,
    )
    return c.json({ progress })
  })

  app.get("/lessons/:lessonId/weak-items", async (c) => {
    const userId = c.get("userId")!
    const lessonId = c.req.param("lessonId")

    const rows = await db
      .select({ weak: userVocabWeakItems, word: vocabWords })
      .from(userVocabWeakItems)
      .innerJoin(vocabWords, eq(userVocabWeakItems.vocabularyWordId, vocabWords.id))
      .where(
        and(
          eq(userVocabWeakItems.userId, userId),
          or(
            and(
              eq(userVocabWeakItems.status, "active"),
              eq(userVocabWeakItems.lessonId, lessonId),
            ),
            and(
              eq(userVocabWeakItems.status, "carried"),
              eq(userVocabWeakItems.targetLessonId, lessonId),
            ),
          ),
        ),
      )

    return c.json({
      items: rows.map(({ weak, word }) => ({
        id: weak.id,
        wordId: word.slug,
        lessonId: weak.lessonId,
        targetLessonId: weak.targetLessonId,
        weakSource: weak.weakSource,
        reviewFlashcardRequired: weak.reviewFlashcardRequired,
        status: weak.status,
        word: mapVocabWordRow(word),
      })),
    })
  })

  app.post("/lessons/:lessonId/weak-items", async (c) => {
    const userId = c.get("userId")!
    const body = upsertWeakBodySchema.parse(await c.req.json())

    const wordRows = await db
      .select()
      .from(vocabWords)
      .where(and(eq(vocabWords.lessonId, body.lessonId), eq(vocabWords.slug, body.wordId)))
      .limit(1)
    const word = wordRows[0]
    if (!word) return c.json({ error: "Word not found" }, 404)

    const id = `${userId}:${word.id}:${body.lessonId}`
    const now = new Date().toISOString()

    await db
      .insert(userVocabWeakItems)
      .values({
        id,
        userId,
        vocabularyWordId: word.id,
        lessonId: body.lessonId,
        targetLessonId: body.targetLessonId ?? null,
        weakSource: body.weakSource,
        reviewFlashcardRequired: body.reviewFlashcardRequired,
        status: "active",
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: userVocabWeakItems.id,
        set: {
          weakSource: body.weakSource,
          reviewFlashcardRequired: body.reviewFlashcardRequired,
          status: "active",
          clearedAt: null,
        },
      })

    return c.json({ ok: true, id })
  })

  app.patch("/lessons/:lessonId/weak-items/clear-word", async (c) => {
    const userId = c.get("userId")!
    const lessonId = c.req.param("lessonId")
    const body = clearVocabWeakWordBodySchema.parse(await c.req.json())
    if (body.lessonId !== lessonId) {
      return c.json({ error: "lessonId mismatch" }, 400)
    }

    const now = new Date().toISOString()
    const wordRows = await db
      .select()
      .from(vocabWords)
      .where(and(eq(vocabWords.lessonId, lessonId), eq(vocabWords.slug, body.wordId)))
      .limit(1)
    const word = wordRows[0]
    if (!word) return c.json({ ok: true, cleared: 0 })

    const rows = await db
      .select({ id: userVocabWeakItems.id })
      .from(userVocabWeakItems)
      .where(
        and(
          eq(userVocabWeakItems.userId, userId),
          eq(userVocabWeakItems.vocabularyWordId, word.id),
          or(
            and(eq(userVocabWeakItems.lessonId, lessonId), eq(userVocabWeakItems.status, "active")),
            and(
              eq(userVocabWeakItems.targetLessonId, lessonId),
              eq(userVocabWeakItems.status, "carried"),
            ),
          ),
        ),
      )

    for (const row of rows) {
      await db
        .update(userVocabWeakItems)
        .set({ status: "cleared", clearedAt: now })
        .where(and(eq(userVocabWeakItems.id, row.id), eq(userVocabWeakItems.userId, userId)))
    }

    return c.json({ ok: true, cleared: rows.length })
  })

  app.post("/lessons/:targetLessonId/carry", async (c) => {
    const userId = c.get("userId")!
    const targetLessonId = c.req.param("targetLessonId")
    const body = carryBodySchema.parse(await c.req.json())
    await replaceCarryRows(userId, targetLessonId, body.sourceLessonId, body.items)
    return c.json({ ok: true })
  })

  app.patch("/weak-items/:itemId/clear", async (c) => {
    const userId = c.get("userId")!
    const itemId = c.req.param("itemId")
    const now = new Date().toISOString()

    await db
      .update(userVocabWeakItems)
      .set({ status: "cleared", clearedAt: now })
      .where(and(eq(userVocabWeakItems.id, itemId), eq(userVocabWeakItems.userId, userId)))

    return c.json({ ok: true })
  })

  app.post("/guest-data/merge", async (c) => {
    const userId = c.get("userId")!
    const body = guestVocabMergeBodySchema.parse(await c.req.json())
    const service = createProgressService()
    const result = await service.mergeGuestData(userId, body)

    let carryApplied = 0
    for (const carry of body.carryEntries) {
      const targetId = await resolveLessonDbId("en", carry.targetLessonId)
      const sourceId = await resolveLessonDbId("en", carry.sourceLessonId)
      if (!targetId || !sourceId) continue
      await replaceCarryRows(userId, targetId, sourceId, carry.items)
      carryApplied += 1
    }

    return c.json({ ...result, carryApplied })
  })

  return app
}
