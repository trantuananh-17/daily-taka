"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { findActiveSentenceIndex } from "@/features/listen/dictation/find-active-sentence-index"
import { formatDictationClockMs } from "@/lib/learn/listening/dictation-time"
import type { DictationSentence } from "@/lib/learn/listening/types"

export function useTranscriptLessonAudio(
  audioUrl: string | undefined,
  sentences: DictationSentence[],
  durationMs: number,
  playbackRate: number,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const totalMs = Math.max(
    durationMs,
    sentences.at(-1)?.endMs ?? 0,
    sentences.at(-1)?.startMs ?? 0,
    1,
  )

  const stopProgressLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

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
      setCurrentTimeMs(timeMs)
      setPinnedIndex(null)

      if (timeMs >= totalMs - 40) {
        audio.pause()
        setPlaying(false)
        setCurrentTimeMs(totalMs)
        stopProgressLoop()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return stopProgressLoop
  }, [playing, totalMs, stopProgressLoop])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return
    if (playing) {
      audio.pause()
      setCurrentTimeMs(audio.currentTime * 1000)
      setPlaying(false)
      return
    }
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    )
  }, [audioUrl, playing])

  const seekToMs = useCallback(
    (timeMs: number, options?: { play?: boolean; pinIndex?: number | null }) => {
      const audio = audioRef.current
      if (!audio || !audioUrl) return
      const clamped = Math.min(totalMs, Math.max(0, timeMs))
      audio.currentTime = clamped / 1000
      setCurrentTimeMs(clamped)
      if (options?.pinIndex !== undefined) {
        setPinnedIndex(options.pinIndex)
      } else {
        setPinnedIndex(null)
      }
      if (options?.play) {
        void audio.play().then(
          () => setPlaying(true),
          () => setPlaying(false),
        )
      }
    },
    [audioUrl, totalMs],
  )

  const seekToSentence = useCallback(
    (index: number, play = true) => {
      const sentence = sentences[index]
      if (!sentence || sentence.startMs == null) return
      seekToMs(sentence.startMs, { play, pinIndex: play ? null : index })
    },
    [sentences, seekToMs],
  )

  const activeIndex =
    pinnedIndex ?? findActiveSentenceIndex(sentences, currentTimeMs)

  const progressRatio = currentTimeMs / totalMs
  const clockLabel = `${formatDictationClockMs(currentTimeMs)} / ${formatDictationClockMs(totalMs)}`

  return {
    audioRef,
    playing,
    togglePlay,
    seekToSentence,
    activeIndex,
    progressRatio,
    clockLabel,
    hasAudio: Boolean(audioUrl),
  }
}
