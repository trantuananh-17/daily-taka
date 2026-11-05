import { z } from "zod"

export const upsertWritingProgressBodySchema = z.object({
  status: z.enum(["in_progress", "completed"]).optional(),
  currentSentenceIndex: z.number().int().min(0).optional(),
  doneSentenceIndexes: z.array(z.number().int().min(0)).optional(),
  drafts: z.record(z.string(), z.string()).optional(),
  scriptModeId: z.string().nullable().optional(),
})

export const guestWritingProgressEntrySchema = z.object({
  language: z.enum(["en"]),
  lessonId: z.string().min(1),
  sectionId: z.string().min(1),
  level: z.string().min(1),
  lessonContentId: z.string().min(1),
  status: z.enum(["in_progress", "completed"]),
  currentSentenceIndex: z.number().int().min(0),
  doneSentenceIndexes: z.array(z.number().int().min(0)),
  drafts: z.record(z.string(), z.string()).optional(),
  scriptModeId: z.string().nullable().optional(),
})

export const guestWritingMergeBodySchema = z.object({
  entries: z.array(guestWritingProgressEntrySchema).default([]),
})
