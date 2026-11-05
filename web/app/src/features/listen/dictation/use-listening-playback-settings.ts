"use client"

import { useCallback, useEffect, useState } from "react"

import { authClient } from "@/lib/auth/client"
import { apiGetUserSettings, apiPatchUserSettings } from "@/lib/learn/listening/listening-user-api"
import {
  DEFAULT_LISTENING_PLAYBACK_SETTINGS,
  readListeningPlaybackSettings,
  saveListeningPlaybackSettings,
  type ListeningPlaybackSettings,
} from "@/lib/learn/listening/listening-playback-settings"

export function useListeningPlaybackSettings() {
  const { data: session } = authClient.useSession()
  const [ready, setReady] = useState(false)
  const [settings, setSettings] = useState<ListeningPlaybackSettings>(
    DEFAULT_LISTENING_PLAYBACK_SETTINGS,
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const local = readListeningPlaybackSettings()
      if (!session?.user) {
        if (!cancelled) {
          setSettings(local)
          setReady(true)
        }
        return
      }
      try {
        const { preferences } = await apiGetUserSettings()
        const remote = preferences.listeningPlayback
        if (!cancelled) {
          setSettings(remote ? { ...DEFAULT_LISTENING_PLAYBACK_SETTINGS, ...remote } : local)
        }
      } catch {
        if (!cancelled) setSettings(local)
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [session?.user])

  const persistSettings = useCallback(
    (next: ListeningPlaybackSettings) => {
      setSettings(next)
      saveListeningPlaybackSettings(next)
      if (session?.user) {
        void apiPatchUserSettings({ listeningPlayback: next })
      }
    },
    [session?.user],
  )

  return { ready, settings, persistSettings }
}
