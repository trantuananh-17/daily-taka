"use client"

import { useCallback, useEffect, useState } from "react"

import {
  DEFAULT_LISTENING_PLAYBACK_SETTINGS,
  readListeningPlaybackSettings,
  saveListeningPlaybackSettings,
  type ListeningPlaybackSettings,
} from "@/lib/learn/listening/listening-playback-settings"

export function useListeningPlaybackSettings() {
  const [ready, setReady] = useState(false)
  const [settings, setSettings] = useState<ListeningPlaybackSettings>(
    DEFAULT_LISTENING_PLAYBACK_SETTINGS,
  )

  useEffect(() => {
    setSettings(readListeningPlaybackSettings())
    setReady(true)
  }, [])

  const persistSettings = useCallback((next: ListeningPlaybackSettings) => {
    setSettings(next)
    saveListeningPlaybackSettings(next)
  }, [])

  return { ready, settings, persistSettings }
}
