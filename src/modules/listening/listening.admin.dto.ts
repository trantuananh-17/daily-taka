import { z } from "zod"

export const createCategoryBodySchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  descriptionVi: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  levels: z.array(z.string()).optional(),
  cover: z.unknown().optional(),
  lessonCount: z.number().int().optional(),
  isPublished: z.boolean().optional(),
})

export const updateCategoryBodySchema = createCategoryBodySchema.partial().extend({
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
})

export const createSectionBodySchema = z.object({
  id: z.string().min(1).optional(),
  sectionNumber: z.number().int().positive(),
  title: z.string().min(1),
  sortOrder: z.number().int().optional(),
  access: z.enum(["full", "preview", "locked"]).optional(),
})

export const updateSectionBodySchema = createSectionBodySchema.partial().extend({
  sectionNumber: z.number().int().positive().optional(),
  title: z.string().min(1).optional(),
})

export const createLessonBodySchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  levelCode: z.string().min(1),
  displayOrder: z.number().int().positive(),
  sentenceCount: z.number().int().nonnegative().optional(),
  durationMs: z.number().int().nullable().optional(),
  stars: z.number().int().min(0).max(5).optional(),
  templateType: z.string().optional(),
  audioStorageKey: z.string().nullable().optional(),
  audioPublicPath: z.string().nullable().optional(),
  path: z.string().nullable().optional(),
  dictationGradingDefaults: z
    .object({
      ignoreCase: z.boolean(),
      ignorePunctuation: z.boolean(),
    })
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  isPublished: z.boolean().optional(),
})

export const updateLessonBodySchema = createLessonBodySchema.partial().extend({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  levelCode: z.string().min(1).optional(),
  displayOrder: z.number().int().positive().optional(),
})

export const upsertSentencesBodySchema = z.object({
  sentences: z
    .array(
      z.object({
        position: z.number().int().positive(),
        startMs: z.number().int().nonnegative(),
        endMs: z.number().int().nonnegative(),
        transcript: z.string().min(1),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .min(1),
})

export const updateSentenceBodySchema = z.object({
  position: z.number().int().positive().optional(),
  startMs: z.number().int().nonnegative().optional(),
  endMs: z.number().int().nonnegative().optional(),
  transcript: z.string().min(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
