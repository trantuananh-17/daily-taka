import type { ListeningPlaybackSettingsDto } from "./user-settings.dto"
import type { UserSettingsRepository } from "./user-settings.repository"

const PREFERENCES_VERSION = 1

export class UserSettingsService {
  constructor(private readonly repo: UserSettingsRepository) {}

  async getSettings(userId: string) {
    const row = await this.repo.findByUserId(userId)
    const preferences = (row?.preferences ?? {}) as Record<string, unknown>
    return {
      listeningPlayback: preferences.listeningPlayback as ListeningPlaybackSettingsDto | undefined,
    }
  }

  async patchSettings(userId: string, patch: { listeningPlayback?: ListeningPlaybackSettingsDto }) {
    const row = await this.repo.findByUserId(userId)
    const current = (row?.preferences ?? {}) as Record<string, unknown>

    const next = {
      ...current,
      _version: PREFERENCES_VERSION,
      ...(patch.listeningPlayback ? { listeningPlayback: patch.listeningPlayback } : {}),
    }

    await this.repo.upsertPreferences(userId, next)
    return this.getSettings(userId)
  }

  async mergeListeningPlayback(userId: string, playback: ListeningPlaybackSettingsDto) {
    const row = await this.repo.findByUserId(userId)
    const current = (row?.preferences ?? {}) as Record<string, unknown>
    if (current.listeningPlayback) return

    const next = {
      ...current,
      _version: PREFERENCES_VERSION,
      listeningPlayback: playback,
    }
    await this.repo.upsertPreferences(userId, next)
  }
}
