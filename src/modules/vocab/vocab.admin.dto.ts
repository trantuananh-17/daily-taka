import { z } from "zod"

export const updateVocabLessonBodySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z.string().min(1).optional(),
  storyId: z.string().min(1).optional(),
  wordCount: z.number().int().nonnegative().optional(),
  sortOrder: z.number().int().optional(),
  nextStoryId: z.string().nullable().optional(),
  nextStoryTitle: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
})

export const vocabWordInputSchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1),
  term: z.string().min(1),
  ipa: z.string().optional(),
  partOfSpeech: z.string().min(1),
  meaningVi: z.string().min(1),
  definition: z.string().min(1),
  example: z.string().min(1),
  exampleVi: z.string().min(1),
  collocations: z.array(z.string()).optional(),
  distractors: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
})

export const upsertVocabWordsBodySchema = z.object({
  words: z.array(vocabWordInputSchema),
})

export type UpdateVocabLessonInput = z.infer<typeof updateVocabLessonBodySchema>
export type UpsertVocabWordsInput = z.infer<typeof upsertVocabWordsBodySchema>
