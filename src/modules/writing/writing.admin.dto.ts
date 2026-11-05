import { z } from "zod"

export const updateWritingLessonBodySchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  sentenceCount: z.number().int().nonnegative().optional(),
  sortOrder: z.number().int().optional(),
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

export type UpsertWritingSentencesInput = z.infer<typeof upsertWritingSentencesBodySchema>
