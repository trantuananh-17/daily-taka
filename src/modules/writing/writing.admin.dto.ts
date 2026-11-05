import { z } from "zod"

export const createWritingTopicBodySchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
})

export const createWritingLessonBodySchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1),
  contentId: z.string().min(1),
  title: z.string().min(1),
  levelCode: z.string().min(1).optional(),
  scriptModes: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        inputKind: z.enum(["latin", "cjk"]),
      }),
    )
    .nullable()
    .optional(),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
})

export const updateWritingLessonBodySchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  contentId: z.string().min(1).optional(),
  levelCode: z.string().min(1).optional(),
  sentenceCount: z.number().int().nonnegative().optional(),
  sortOrder: z.number().int().optional(),
  scriptModes: createWritingLessonBodySchema.shape.scriptModes,
  isPublished: z.boolean().optional(),
})

export const writingSentenceInputSchema = z.object({
  slug: z.string().min(1).optional(),
  promptVi: z.string().min(1),
  targetDefault: z.string().min(1),
  targetsByMode: z.record(z.string(), z.string()).optional(),
  pronunciationKind: z.string().nullable().optional(),
  pronunciation: z
    .array(
      z.object({
        word: z.string(),
        ipa: z.string().optional(),
        pinyin: z.string().optional(),
        romaji: z.string().optional(),
      }),
    )
    .optional(),
  sortOrder: z.number().int().optional(),
})

export const upsertWritingSentencesBodySchema = z.object({
  sentences: z.array(writingSentenceInputSchema),
})

export type CreateWritingTopicInput = z.infer<typeof createWritingTopicBodySchema>
export type CreateWritingLessonInput = z.infer<typeof createWritingLessonBodySchema>
export type UpdateWritingLessonInput = z.infer<typeof updateWritingLessonBodySchema>
export type UpsertWritingSentencesInput = z.infer<typeof upsertWritingSentencesBodySchema>
