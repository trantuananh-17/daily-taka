"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  Headphones,
  Lightbulb,
  Mic,
  RotateCcw,
  Settings2,
  SkipForward,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { listeningLessonHref } from "@/lib/learn/listening/listening-hrefs"
import type { LanguageHubCode } from "@/lib/learn/hub"
import {
  checkDictationAnswer,
  isDictationAnswerSubmittable,
  resolveDictationGrading,
  sanitizeDictationInput,
} from "@/lib/learn/listening/dictation-answer-check"
import { dictationGradingHintLabel } from "@/lib/learn/listening/dictation-grading-hint"
import type { DictationLessonDetail } from "@/lib/learn/listening/types"

import { PlaybackRateSelect } from "@/features/listen/dictation/playback-rate-select"
import { DictationAnswerFeedback } from "@/features/listen/dictation/dictation-answer-feedback"
import { DictationAudioBar } from "@/features/listen/dictation/dictation-audio-bar"
import { DictationShortcutHints } from "@/features/listen/dictation/dictation-shortcut-hints"
import { ListeningPlaybackSettingsDialog } from "@/features/listen/dictation/listening-playback-settings-dialog"
import { TranscriptPanel } from "@/features/listen/dictation/transcript-panel"
import { useDictationKeyboardShortcuts } from "@/features/listen/dictation/use-dictation-keyboard-shortcuts"
import { useGuestDictationProgress } from "@/features/listen/dictation/use-guest-dictation-progress"
import { useDictationSentenceAudio } from "@/features/listen/dictation/use-dictation-sentence-audio"
import { useListeningPlaybackSettings } from "@/features/listen/dictation/use-listening-playback-settings"

type DictationPlayerProps = {
  language: LanguageHubCode
  detail: DictationLessonDetail
}

type PlayerMode = "dictation" | "transcript"

export function DictationPlayer({ language, detail }: DictationPlayerProps) {
  const {
    lesson,
    sentences,
    nextLesson,
    categorySlug,
    categoryName,
    sectionTitle,
    audioUrl,
    durationMs = 0,
    gradingDefaults,
  } = detail
  const total = sentences.length
  const [mode, setMode] = useState<PlayerMode>("dictation")
  const [answer, setAnswer] = useState("")
  const [checkStatus, setCheckStatus] = useState<"idle" | "wrong" | "correct">("idle")
  const [hintLine, setHintLine] = useState<string | null>(null)
  /** Same as last Kiểm tra submission — must edit before checking again. */
  const [lastCheckedAnswer, setLastCheckedAnswer] = useState<string | null>(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings: playbackSettings, persistSettings } = useListeningPlaybackSettings()

  const {
    sentenceIndex,
    setSentenceIndex,
    correctCount,
    setCorrectCount,
    resetProgress,
  } = useGuestDictationProgress({
    language,
    categorySlug,
    sectionId: lesson.sectionId,
    lessonId: lesson.id,
    sentenceCount: total,
  })

  const current = sentences[sentenceIndex] ?? sentences[0]
  const progressPct = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const gradingHint = useMemo(
    () => dictationGradingHintLabel(current, gradingDefaults),
    [current, gradingDefaults],
  )
  const gradingConfig = useMemo(
    () => resolveDictationGrading(current, gradingDefaults),
    [current, gradingDefaults],
  )
  useEffect(() => {
    setCheckStatus("idle")
    setHintLine(null)
    setLastCheckedAnswer(null)
  }, [sentenceIndex])

  const {
    audioRef,
    playing,
    togglePlay,
    replaySentence,
    progressRatio: audioProgressRatio,
    clockLabel,
    hasClip,
  } = useDictationSentenceAudio(audioUrl, current, playbackRate, {
    autoReplay: playbackSettings.autoReplay,
    replayGapSeconds: playbackSettings.replayGapSeconds,
  })

  const resetSentenceAttemptUi = useCallback(() => {
    setCheckStatus("idle")
    setHintLine(null)
    setLastCheckedAnswer(null)
  }, [])

  const goPrev = useCallback(() => {
    setSentenceIndex((index) => Math.max(0, index - 1))
    setAnswer("")
    resetSentenceAttemptUi()
  }, [resetSentenceAttemptUi, setSentenceIndex])

  const goNextSentence = useCallback(() => {
    setSentenceIndex((index) => Math.min(total - 1, index + 1))
    setAnswer("")
    resetSentenceAttemptUi()
  }, [resetSentenceAttemptUi, setSentenceIndex, total])

  /** Back only into sentences answered correctly (index < correctCount). */
  const canGoPrevSentence = sentenceIndex > 0 && sentenceIndex - 1 < correctCount

  const canSubmitAnswer = useMemo(() => {
    if (!isDictationAnswerSubmittable(answer)) return false
    if (lastCheckedAnswer !== null && answer === lastCheckedAnswer) return false
    return true
  }, [answer, lastCheckedAnswer])

  const handleCheck = useCallback(() => {
    const transcript = current?.transcript ?? ""
    if (!transcript.trim() || !canSubmitAnswer) return

    const result = checkDictationAnswer(transcript, answer, gradingConfig)
    setLastCheckedAnswer(answer)

    if (result.correct) {
      setCheckStatus("correct")
      setHintLine(null)
      setCorrectCount((count) => Math.min(total, count + 1))
      if (sentenceIndex < total - 1) {
        setSentenceIndex((index) => index + 1)
        setAnswer("")
        setCheckStatus("idle")
        setLastCheckedAnswer(null)
      }
      return
    }

    setCheckStatus("wrong")
    setHintLine(result.hintLine)
  }, [
    answer,
    current?.transcript,
    gradingConfig,
    sentenceIndex,
    setCorrectCount,
    setSentenceIndex,
    total,
    canSubmitAnswer,
  ])

  const handleSkip = useCallback(() => {
    if (sentenceIndex >= total - 1) return
    goNextSentence()
  }, [goNextSentence, sentenceIndex, total])

  const handleAnswerChange = useCallback(
    (raw: string) => {
      const next = sanitizeDictationInput(raw)
      setAnswer(next)
      if (lastCheckedAnswer !== null && next !== lastCheckedAnswer && checkStatus === "wrong") {
        setCheckStatus("idle")
      }
    },
    [checkStatus, lastCheckedAnswer],
  )

  const handleRestartFromBeginning = useCallback(() => {
    resetProgress()
    setAnswer("")
    resetSentenceAttemptUi()
  }, [resetProgress, resetSentenceAttemptUi])

  const keyboardActions = useMemo(
    () => ({
      onPlayPause: () => {
        if (hasClip) togglePlay()
      },
      onReplay: () => {
        if (hasClip) replaySentence()
      },
      onCheckNext: handleCheck,
      onSkip: handleSkip,
    }),
    [hasClip, togglePlay, replaySentence, handleCheck, handleSkip],
  )

  useDictationKeyboardShortcuts(mode === "dictation", playbackSettings, keyboardActions)

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[length:var(--dlx-h3-size)] font-extrabold leading-tight text-[var(--dlx-ink)]">
            {lesson.title}
          </h1>
          <p className="mt-1 font-body text-sm text-[var(--dlx-muted)]">Trình độ: {lesson.level}</p>
        </div>
        <div className="min-w-[8rem] text-right">
          <p className="m-0 font-body text-sm font-semibold text-[var(--dlx-muted)]">
            {correctCount}/{total} câu
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--dlx-neutral-1)]">
            <div
              className="h-full rounded-full bg-[var(--dlx-primary)] transition-[width]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-sm">
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors",
              mode === "dictation"
                ? "bg-[var(--dlx-primary)] text-white"
                : "text-[var(--dlx-body)] hover:bg-[var(--dlx-neutral-1)]",
            )}
            onClick={() => setMode("dictation")}
          >
            <Headphones className="size-4" strokeWidth={2} aria-hidden />
            Nghe và chép
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors",
              mode === "transcript"
                ? "bg-[var(--dlx-primary)] text-white"
                : "text-[var(--dlx-body)] hover:bg-[var(--dlx-neutral-1)]",
            )}
            onClick={() => setMode("transcript")}
          >
            <BookOpen className="size-4" strokeWidth={2} aria-hidden />
            Toàn bộ transcript
          </button>
        </div>
      </div>

      {mode === "transcript" ? (
        <TranscriptPanel
          audioUrl={audioUrl}
          durationMs={durationMs}
          sentences={sentences}
          playbackRate={playbackRate}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={goPrev}
                disabled={!canGoPrevSentence}
                aria-label="Câu trước (chỉ câu đã làm đúng)"
              >
                ‹
              </Button>
              <span className="min-w-[3.5rem] text-center font-body text-sm font-semibold text-[var(--dlx-ink)]">
                {sentenceIndex + 1} / {total}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled
                aria-label="Câu sau — dùng Kiểm tra đúng hoặc Bỏ qua"
              >
                ›
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Nghe lại câu này"
                onClick={() => (hasClip ? replaySentence() : undefined)}
              >
                <RotateCcw className="size-4" strokeWidth={2} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings2 className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                Tùy chọn phát
              </Button>
              <PlaybackRateSelect value={playbackRate} onChange={setPlaybackRate} />
            </div>
          </div>

          {audioUrl ? <audio ref={audioRef} src={audioUrl} preload="metadata" /> : null}

          <DictationAudioBar
            playing={playing}
            onTogglePlay={() => (hasClip ? togglePlay() : undefined)}
            progressRatio={hasClip ? audioProgressRatio : 0}
            clockLabel={hasClip ? clockLabel : `0:00 / ${current?.durationLabel ?? "0:02"}`}
            disabled={!hasClip}
          />

          <DictationShortcutHints
            settings={playbackSettings}
            onRestartFromBeginning={handleRestartFromBeginning}
          />

          <p className="mb-2 font-body text-sm font-medium text-[var(--dlx-ink)]">
            Gõ lại những gì bạn nghe được
          </p>
          <div className="relative">
            <textarea
              value={answer}
              onChange={(event) => handleAnswerChange(event.target.value)}
              placeholder="Bắt đầu nhập câu trả lời..."
              rows={4}
              className={cn(
                "w-full resize-y rounded-xl border-2 bg-white px-4 py-3 pr-12 font-body text-sm text-[var(--dlx-ink)] outline-none focus-visible:ring-2",
                checkStatus === "wrong"
                  ? "border-[var(--dlx-destructive,#dc2626)] focus-visible:ring-[color-mix(in_srgb,var(--dlx-destructive,#dc2626)_35%,transparent)]"
                  : "border-[color-mix(in_srgb,var(--dlx-primary)_45%,var(--dlx-hairline))] focus-visible:ring-[var(--dlx-primary)]",
              )}
            />
            <Mic
              className="pointer-events-none absolute bottom-3 right-3 size-5 text-[var(--dlx-muted)]"
              strokeWidth={2}
              aria-hidden
            />
          </div>

          <DictationAnswerFeedback status={checkStatus} hintLine={hintLine} />

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              {current?.properNouns?.length ? (
                <p className="m-0 font-body text-xs text-[var(--dlx-muted)]">
                  Tên riêng có thể xuất hiện{" "}
                  {current.properNouns.map((noun) => (
                    <span
                      key={noun}
                      className="ml-1 inline-flex rounded-full bg-[var(--dlx-neutral-1)] px-2 py-0.5 font-semibold text-[var(--dlx-link)]"
                    >
                      {noun}
                    </span>
                  ))}
                </p>
              ) : null}
              {gradingHint ? (
                <p className="m-0 font-body text-[11px] text-[var(--dlx-muted)]">{gradingHint}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="dlx-btn-primary min-w-[6.5rem]"
                onClick={handleCheck}
                disabled={!canSubmitAnswer}
              >
                Kiểm tra
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={sentenceIndex >= total - 1}
              >
                Bỏ qua
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--dlx-accent-2)_35%,#fff)] bg-[color-mix(in_srgb,var(--dlx-accent-5)_55%,#fff)] p-4">
        <Lightbulb className="size-5 shrink-0 text-[var(--dlx-accent-4)]" strokeWidth={2} aria-hidden />
        <div>
          <p className="m-0 font-heading text-sm font-bold text-[var(--dlx-accent-4)]">Mẹo luyện nghe</p>
          <p className="mt-1 mb-0 font-body text-xs leading-relaxed text-[var(--dlx-body)]">
            Hãy nghe hai hoặc ba lần trước khi kiểm tra hoặc bỏ qua. Sau khi thấy đáp án, thử đọc to cả câu.
          </p>
        </div>
      </div>

      {nextLesson ? (
        <Link
          href={listeningLessonHref(language, categorySlug, nextLesson.sectionId, nextLesson.slug)}
          className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 no-underline shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--dlx-neutral-1)] text-[var(--dlx-primary)]">
            <Headphones className="size-6" strokeWidth={2} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-body text-[11px] font-bold uppercase tracking-wide text-[var(--dlx-primary)]">
              Bài nghe tiếp theo
            </span>
            <span className="mt-0.5 block font-heading text-base font-bold text-[var(--dlx-ink)]">
              {nextLesson.title}
            </span>
            <span className="mt-1 block font-body text-xs text-[var(--dlx-muted)]">
              {categoryName} · {sectionTitle} · Trình độ: {nextLesson.level} · {nextLesson.sentenceCount} câu
            </span>
          </span>
          <SkipForward className="size-5 shrink-0 text-[var(--dlx-muted)]" strokeWidth={2} aria-hidden />
        </Link>
      ) : null}

      <ListeningPlaybackSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={playbackSettings}
        onSave={persistSettings}
      />
    </div>
  )
}
