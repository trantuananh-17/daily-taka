import { z } from "zod"

import { listeningPlaybackSettingsSchema } from "../user-settings/user-settings.dto"

export const listenProgressStatusSchema = z.enum(["not_started", "in_progress", "completed"])

export const upsertListenProgressBodySchema = z.object({
  status: listenProgressStatusSchema.optional(),
  completedSentenceCount: z.number().int().min(0).optional(),
  lastSentencePosition: z.number().int().min(1).optional(),
  lastPositionMs: z.number().int().min(0).nullable().optional(),
  completionCycleActive: z.boolean().optional(),
})

export const patchListenStarBodySchema = z.object({
  isStarred: z.boolean().optional(),
  starCount: z.number().int().min(0).max(5).optional(),
})

export const guestListeningProgressEntrySchema = z.object({
  language: z.enum(["en", "zh", "jp"]),
  categorySlug: z.string().min(1),
  lessonId: z.string().min(1),
  sectionId: z.string().min(1),
  status: z.enum(["in_progress", "completed"]),
  completedAt: z.string().optional(),
})

export const guestDictationProgressEntrySchema = z.object({
  language: z.enum(["en", "zh", "jp"]),
  categorySlug: z.string().min(1),
  sectionId: z.string().min(1),
  lessonId: z.string().min(1),
  correctCount: z.number().int().min(0),
  currentSentenceIndex: z.number().int().min(0),
  updatedAt: z.string().optional(),
})

export const guestProgressMergeBodySchema = z.object({
  lessonEntries: z.array(guestListeningProgressEntrySchema).default([]),
  dictationEntries: z.array(guestDictationProgressEntrySchema).default([]),
  playbackSettings: listeningPlaybackSettingsSchema.optional(),
})
