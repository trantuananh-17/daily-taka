"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { formatDictationClockMs } from "@/lib/learn/listening/dictation-time"
import type { DictationSentence } from "@/lib/learn/listening/types"

function segmentElapsedFromAudio(audio: HTMLAudioElement, startMs: number, segmentDurationMs: number) {
  const timeMs = audio.currentTime * 1000
  return Math.min(segmentDurationMs, Math.max(0, timeMs - startMs))
}

type SentenceAudioPlaybackOptions = {
  autoReplay?: boolean
  replayGapSeconds?: number
}

export function useDictationSentenceAudio(
  audioUrl: string | undefined,
  sentence: DictationSentence | undefined,
  playbackRate: number,
  playbackOptions?: SentenceAudioPlaybackOptions,
) {
  const autoReplay = playbackOptions?.autoReplay ?? false
  const replayGapSeconds = playbackOptions?.replayGapSeconds ?? 0.5
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [segmentElapsedMs, setSegmentElapsedMs] = useState(0)
  const rafRef = useRef<number | null>(null)

  const startMs = sentence?.startMs ?? 0
  const endMs =
    sentence?.endMs ?? (sentence?.startMs != null ? sentence.startMs + 2000 : 2000)
  const segmentDurationMs = Math.max(1, endMs - startMs)

  const stopProgressLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  useEffect(() => {
    setPlaying(false)
    setSegmentElapsedMs(0)
    stopProgressLoop()
    const audio = audioRef.current
    if (audio && sentence?.startMs != null) {
      audio.pause()
      audio.currentTime = startMs / 1000
    }
  }, [sentence?.index, sentence?.startMs, startMs, audioUrl, stopProgressLoop])

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

      if (timeMs >= endMs - 30) {
        audio.pause()
        setPlaying(false)
        setSegmentElapsedMs(segmentDurationMs)
        stopProgressLoop()
        if (autoReplay) {
          window.setTimeout(() => {
            const clip = audioRef.current
            if (!clip) return
            clip.currentTime = startMs / 1000
            setSegmentElapsedMs(0)
            void clip.play().then(
              () => setPlaying(true),
              () => setPlaying(false),
            )
          }, replayGapSeconds * 1000)
        }
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return stopProgressLoop
  }, [playing, startMs, endMs, segmentDurationMs, stopProgressLoop, autoReplay, replayGapSeconds])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return
    if (playing) {
      audio.pause()
      setSegmentElapsedMs(segmentElapsedFromAudio(audio, startMs, segmentDurationMs))
      setPlaying(false)
      return
    }
    const timeMs = audio.currentTime * 1000
    if (timeMs < startMs || timeMs >= endMs) {
      audio.currentTime = startMs / 1000
      setSegmentElapsedMs(0)
    }
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    )
  }, [audioUrl, playing, startMs, endMs, segmentDurationMs])

  const replaySentence = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return
    audio.currentTime = startMs / 1000
    setSegmentElapsedMs(0)
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    )
  }, [audioUrl, startMs])

  const progressRatio = segmentElapsedMs / segmentDurationMs
  const clockLabel = `${formatDictationClockMs(segmentElapsedMs)} / ${formatDictationClockMs(segmentDurationMs)}`

  return {
    audioRef,
    playing,
    togglePlay,
    replaySentence,
    progressRatio,
    clockLabel,
    hasClip: Boolean(audioUrl && sentence?.startMs != null && sentence?.endMs != null),
  }
}
