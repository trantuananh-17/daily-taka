"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { formatDictationClockMs } from "@/lib/learn/listening/dictation-time"
import { sentencePlaybackWindow } from "@/lib/learn/listening/normalize-lesson-detail"
import type { DictationSentence } from "@/lib/learn/listening/types"

function segmentElapsedFromAudio(audio: HTMLAudioElement, startMs: number, segmentDurationMs: number) {
  const timeMs = audio.currentTime * 1000
  return Math.min(segmentDurationMs, Math.max(0, timeMs - startMs))
}

function waitForMetadata(audio: HTMLAudioElement): Promise<boolean> {
  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) return Promise.resolve(true)
  return new Promise((resolve) => {
    const finish = (ok: boolean) => {
      audio.removeEventListener("loadedmetadata", onMeta)
      audio.removeEventListener("error", onError)
      resolve(ok)
    }
    const onMeta = () => finish(true)
    const onError = () => finish(false)
    audio.addEventListener("loadedmetadata", onMeta, { once: true })
    audio.addEventListener("error", onError, { once: true })
  })
}

/** Seek then play — wait for `seeked` so Space after a finished clip does not jump to another sentence. */
async function seekAndPlay(audio: HTMLAudioElement, startMs: number): Promise<boolean> {
  if (!(await waitForMetadata(audio))) return false

  const targetSec = startMs / 1000

  try {
    if (Math.abs(audio.currentTime - targetSec) > 0.02) {
      const seeked = await new Promise<boolean>((resolve) => {
        const timeout = window.setTimeout(() => {
          cleanup()
          resolve(Math.abs(audio.currentTime - targetSec) < 0.12)
        }, 800)
        const onSeeked = () => {
          cleanup()
          resolve(true)
        }
        const onError = () => {
          cleanup()
          resolve(false)
        }
        const cleanup = () => {
          window.clearTimeout(timeout)
          audio.removeEventListener("seeked", onSeeked)
          audio.removeEventListener("error", onError)
        }
        audio.addEventListener("seeked", onSeeked, { once: true })
        audio.addEventListener("error", onError, { once: true })
        audio.currentTime = targetSec
      })
      if (!seeked) return false
    }

    await audio.play()
    return true
  } catch {
    return false
  }
}

function snapToSegmentStart(audio: HTMLAudioElement, startMs: number) {
  const targetSec = startMs / 1000
  if (Math.abs(audio.currentTime - targetSec) > 0.02) {
    audio.currentTime = targetSec
  }
}

type SentenceAudioPlaybackOptions = {
  autoReplay?: boolean
  replayGapSeconds?: number
}

export function useDictationSentenceAudio(
  audioUrl: string | undefined,
  sentence: DictationSentence | undefined,
  lessonDurationMs: number,
  playbackRate: number,
  playbackOptions?: SentenceAudioPlaybackOptions,
) {
  const autoReplay = playbackOptions?.autoReplay ?? false
  const replayGapSeconds = playbackOptions?.replayGapSeconds ?? 0.5
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [segmentElapsedMs, setSegmentElapsedMs] = useState(0)
  const rafRef = useRef<number | null>(null)
  const autoReplayTimerRef = useRef<number | null>(null)

  const playbackWindow = useMemo(
    () => sentencePlaybackWindow(sentence, lessonDurationMs),
    [sentence, lessonDurationMs],
  )
  const startMs = playbackWindow?.startMs ?? 0
  const endMs = playbackWindow?.endMs ?? Math.max(startMs + 2000, 2000)
  const endSec = endMs / 1000
  const segmentDurationMs = Math.max(1, endMs - startMs)
  const hasClip = Boolean(audioUrl && playbackWindow)

  const stopProgressLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const clearAutoReplayTimer = useCallback(() => {
    if (autoReplayTimerRef.current != null) {
      window.clearTimeout(autoReplayTimerRef.current)
      autoReplayTimerRef.current = null
    }
  }, [])

  const finishSegment = useCallback(
    (audio: HTMLAudioElement) => {
      audio.pause()
      snapToSegmentStart(audio, startMs)
      setPlaying(false)
      setSegmentElapsedMs(segmentDurationMs)
      stopProgressLoop()
    },
    [startMs, segmentDurationMs, stopProgressLoop],
  )

  useEffect(() => {
    setPlaying(false)
    setSegmentElapsedMs(0)
    stopProgressLoop()
    clearAutoReplayTimer()
    const audio = audioRef.current
    if (audio && playbackWindow) {
      audio.pause()
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        snapToSegmentStart(audio, startMs)
      }
    }
  }, [sentence?.index, playbackWindow, startMs, audioUrl, stopProgressLoop, clearAutoReplayTimer])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.playbackRate = playbackRate
  }, [playbackRate])

  useEffect(() => {
    if (!playing) {
      stopProgressLoop()
      return
    }

    const tick = () => {
      const audio = audioRef.current
      if (!audio || audio.paused) {
        stopProgressLoop()
        return
      }

      const timeMs = audio.currentTime * 1000
      const elapsed = segmentElapsedFromAudio(audio, startMs, segmentDurationMs)
      setSegmentElapsedMs(elapsed)

      if (timeMs >= endMs - 50 || audio.currentTime >= endSec - 0.05) {
        finishSegment(audio)
        if (autoReplay) {
          autoReplayTimerRef.current = window.setTimeout(() => {
            autoReplayTimerRef.current = null
            void seekAndPlay(audio, startMs).then((ok) => {
              setPlaying(ok)
              if (ok) setSegmentElapsedMs(0)
            })
          }, replayGapSeconds * 1000)
        }
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return stopProgressLoop
  }, [
    playing,
    startMs,
    endMs,
    endSec,
    segmentDurationMs,
    stopProgressLoop,
    autoReplay,
    replayGapSeconds,
    finishSegment,
  ])

  useEffect(() => clearAutoReplayTimer, [clearAutoReplayTimer])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl || !playbackWindow) return

    clearAutoReplayTimer()

    if (playing) {
      audio.pause()
      setSegmentElapsedMs(segmentElapsedFromAudio(audio, startMs, segmentDurationMs))
      setPlaying(false)
      return
    }

    const timeMs = audio.currentTime * 1000
    const atEnd = timeMs >= endMs - 50 || segmentElapsedMs >= segmentDurationMs - 20
    const beforeStart = timeMs < startMs - 50
    const seekTo = atEnd || beforeStart ? startMs : timeMs

    void seekAndPlay(audio, seekTo).then((ok) => {
      setPlaying(ok)
      if (ok) {
        setSegmentElapsedMs(seekTo === startMs ? 0 : segmentElapsedFromAudio(audio, startMs, segmentDurationMs))
      }
    })
  }, [
    audioUrl,
    playing,
    startMs,
    endMs,
    segmentDurationMs,
    segmentElapsedMs,
    playbackWindow,
    clearAutoReplayTimer,
  ])

  const replaySentence = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl || !playbackWindow) return
    clearAutoReplayTimer()
    void seekAndPlay(audio, startMs).then((ok) => {
      setPlaying(ok)
      setSegmentElapsedMs(0)
    })
  }, [audioUrl, startMs, playbackWindow, clearAutoReplayTimer])

  const progressRatio = segmentElapsedMs / segmentDurationMs
  const clockLabel = `${formatDictationClockMs(segmentElapsedMs)} / ${formatDictationClockMs(segmentDurationMs)}`

  return {
    audioRef,
    playing,
    togglePlay,
    replaySentence,
    progressRatio,
    clockLabel,
    hasClip,
  }
}
