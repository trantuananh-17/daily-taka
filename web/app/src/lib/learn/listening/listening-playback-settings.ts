/** Keyboard labels stored in settings (guest localStorage until account API). */
export type ListeningPlaybackKey = "Space" | "Ctrl" | "Enter" | "Esc"

export type ListeningPlaybackSettings = {
  playPauseKey: ListeningPlaybackKey
  replayKey: ListeningPlaybackKey
  checkNextKey: ListeningPlaybackKey
  skipKey: ListeningPlaybackKey
  autoReplay: boolean
  /** Used when autoReplay is true. */
  replayGapSeconds: 0.5 | 1 | 1.5 | 2
  showShortcutTips: boolean
  showRestartFromBeginning: boolean
}

export const DEFAULT_LISTENING_PLAYBACK_SETTINGS: ListeningPlaybackSettings = {
  playPauseKey: "Space",
  replayKey: "Ctrl",
  checkNextKey: "Enter",
  skipKey: "Esc",
  autoReplay: false,
  replayGapSeconds: 0.5,
  showShortcutTips: true,
  showRestartFromBeginning: true,
}

const STORAGE_KEY = "dailytaka:listening-playback-settings:v1"

type SettingsStore = {
  version: 1
  settings: ListeningPlaybackSettings
}

export const LISTENING_PLAYBACK_KEY_OPTIONS: ListeningPlaybackKey[] = [
  "Space",
  "Ctrl",
  "Enter",
  "Esc",
]

export function formatListeningPlaybackKeyLabel(key: ListeningPlaybackKey): string {
  return key === "Space" ? "Space" : key
}

export function readListeningPlaybackSettings(): ListeningPlaybackSettings {
  if (typeof window === "undefined") {
    return DEFAULT_LISTENING_PLAYBACK_SETTINGS
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_LISTENING_PLAYBACK_SETTINGS
    const parsed = JSON.parse(raw) as SettingsStore
    if (parsed.version !== 1 || !parsed.settings) {
      return DEFAULT_LISTENING_PLAYBACK_SETTINGS
    }
    return { ...DEFAULT_LISTENING_PLAYBACK_SETTINGS, ...parsed.settings }
  } catch {
    return DEFAULT_LISTENING_PLAYBACK_SETTINGS
  }
}

export function saveListeningPlaybackSettings(settings: ListeningPlaybackSettings) {
  if (typeof window === "undefined") return
  const payload: SettingsStore = { version: 1, settings }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
