import { z } from "zod"

export const listeningPlaybackKeySchema = z.enum(["Space", "Ctrl", "Enter", "Esc"])

export const listeningPlaybackSettingsSchema = z.object({
  playPauseKey: listeningPlaybackKeySchema,
  replayKey: listeningPlaybackKeySchema,
  checkNextKey: listeningPlaybackKeySchema,
  skipKey: listeningPlaybackKeySchema,
  autoReplay: z.boolean(),
  replayGapSeconds: z.union([z.literal(0.5), z.literal(1), z.literal(1.5), z.literal(2)]),
  showShortcutTips: z.boolean(),
  showRestartFromBeginning: z.boolean(),
})

export const patchUserSettingsBodySchema = z.object({
  listeningPlayback: listeningPlaybackSettingsSchema.optional(),
})

export type ListeningPlaybackSettingsDto = z.infer<typeof listeningPlaybackSettingsSchema>
