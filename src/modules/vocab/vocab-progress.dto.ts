import { z } from "zod"

export const vocabProgressStatusSchema = z.enum(["not_started", "in_progress", "completed"])

export const vocabLessonStepSchema = z.enum([
  "overview",
  "intro",
  "flashcard",
  "matching",
  "quiz",
  "review",
  "lessonComplete",
])

export const upsertVocabProgressBodySchema = z.object({
  status: vocabProgressStatusSchema.optional(),
  currentStep: vocabLessonStepSchema.optional(),
  masteredCount: z.number().int().min(0).optional(),
})

export const guestVocabProgressEntrySchema = z.object({
  language: z.enum(["en"]),
  lessonId: z.string().min(1),
  sectionId: z.string().min(1),
  level: z.string().min(1),
  storyId: z.string().min(1),
  status: z.enum(["in_progress", "completed"]),
  currentStep: vocabLessonStepSchema.optional(),
  masteredCount: z.number().int().min(0),
})

export const guestVocabCarryEntrySchema = z.object({
  targetLessonId: z.string().min(1),
  sourceLessonId: z.string().min(1),
  items: z.array(
    z.object({
      wordId: z.string().min(1),
      reviewFlashcardRequired: z.boolean().optional(),
    }),
  ),
})

export const guestVocabMergeBodySchema = z.object({
  lessonEntries: z.array(guestVocabProgressEntrySchema).default([]),
  carryEntries: z.array(guestVocabCarryEntrySchema).default([]),
})

export const clearVocabWeakWordBodySchema = z.object({
  wordId: z.string().min(1),
  lessonId: z.string().min(1),
})
