"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, MessageSquare, PencilLine } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { vocabFlowKickerClass, vocabFlowPrimaryButtonClass, vocabLessonPanelClass } from "@/features/vocab/lesson/vocab-lesson-styles"
import { useWritingLessonProgress } from "@/features/writing/lesson/use-writing-lesson-progress"
import { WritingBlankInput } from "@/features/writing/lesson/writing-blank-input"
import { WritingScriptModeSwitch } from "@/features/writing/lesson/writing-script-mode-switch"
import { useWritingKeyboardShortcuts } from "@/features/writing/lesson/use-writing-keyboard-shortcuts"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { applyProgressToSentences } from "@/lib/learn/writing/guest-writing-lesson-progress"
import {
  resolveWritingInputKind,
  resolveWritingSentenceTarget,
} from "@/lib/learn/writing/resolve-sentence-target"
import type { WritingLesson } from "@/lib/learn/writing/types/lesson"
import {
  isWritingAnswerComplete,
  writingEditableLettersFromTarget,
} from "@/lib/learn/writing/writing-target-cells"
import { resolveHintWordRange, type WritingWordLetterRange } from "@/lib/learn/writing/writing-word-hint"

type WritingLessonPlayerProps = {
  language: LanguageHubCode
  level: string
  sectionId: string
  lesson: WritingLesson
  backHref: string
  nextLessonHref: string | null
}

export function WritingLessonPlayer({
  language,
  level,
  sectionId,
  lesson,
  backHref,
  nextLessonHref,
}: WritingLessonPlayerProps) {
  const scriptModes = lesson.scriptModes ?? []
  const [scriptModeId, setScriptModeId] = useState(() => scriptModes[0]?.id ?? "default")
  const progressLessonId = scriptModes.length > 0 ? `${lesson.id}:${scriptModeId}` : lesson.id
  const inputKind = resolveWritingInputKind(lesson.scriptModes, scriptModeId)

  const total = lesson.sentences.length
  const {
    ready,
    progress,
    sentenceIndex,
    setSentenceIndex,
    markSentenceDone,
    setDraft,
    doneCount,
  } = useWritingLessonProgress({
    language,
    level,
    sectionId,
    lesson,
    scriptModeId,
    progressLessonId,
    sentenceCount: total,
  })

  const sentences = useMemo(
    () => applyProgressToSentences(lesson.sentences, progress),
    [lesson.sentences, progress],
  )

  const current = sentences[sentenceIndex] ?? sentences[0]
  const currentTarget = current
    ? resolveWritingSentenceTarget(current, scriptModes.length > 0 ? scriptModeId : null)
    : ""
  const lexiconWords = useMemo(
    () => current?.pronunciation?.map((row) => row.word) ?? [],
    [current],
  )
  const sentenceDone = progress.doneSentenceIndexes.includes(sentenceIndex)
  const draft =
    progress.drafts?.[sentenceIndex] ??
    (sentenceDone ? writingEditableLettersFromTarget(currentTarget, inputKind) : "")
  const [sentenceComplete, setSentenceComplete] = useState(false)
  const [hintWordRange, setHintWordRange] = useState<WritingWordLetterRange | null>(null)
  const ctrlHintHeldRef = useRef(false)

  useEffect(() => {
    setSentenceComplete(isWritingAnswerComplete(currentTarget, draft, inputKind))
  }, [currentTarget, draft, inputKind, sentenceIndex])

  useEffect(() => {
    ctrlHintHeldRef.current = false
    setHintWordRange(null)
  }, [sentenceIndex, scriptModeId])

  useEffect(() => {
    if (!ctrlHintHeldRef.current || sentenceDone || !currentTarget) return
    setHintWordRange(resolveHintWordRange(currentTarget, draft, inputKind, lexiconWords))
  }, [currentTarget, draft, inputKind, lexiconWords, sentenceDone])

  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const handleDraftChange = useCallback(
    (next: string) => {
      setDraft(sentenceIndex, next)
    },
    [sentenceIndex, setDraft],
  )

  const goNextSentence = useCallback(() => {
    markSentenceDone(sentenceIndex)
    if (sentenceIndex < total - 1) {
      setSentenceIndex(sentenceIndex + 1)
    }
  }, [markSentenceDone, sentenceIndex, setSentenceIndex, total])

  const handleSkip = useCallback(() => {
    if (sentenceIndex >= total - 1) return
    markSentenceDone(sentenceIndex)
    setSentenceIndex(sentenceIndex + 1)
  }, [markSentenceDone, sentenceIndex, setSentenceIndex, total])

  const handleComplete = useCallback(() => {
    setSentenceComplete(true)
  }, [])

  const allDone = doneCount >= total && total > 0

  const draftRef = useRef(draft)
  const targetRef = useRef(currentTarget)
  const lexiconWordsRef = useRef(lexiconWords)
  draftRef.current = draft
  targetRef.current = currentTarget
  lexiconWordsRef.current = lexiconWords

  const onCtrlHint = useCallback(
    (active: boolean) => {
      ctrlHintHeldRef.current = active
      if (sentenceDone || !targetRef.current) {
        setHintWordRange(null)
        return
      }
      if (!active) {
        setHintWordRange(null)
        return
      }
      setHintWordRange(
        resolveHintWordRange(targetRef.current, draftRef.current, inputKind, lexiconWordsRef.current),
      )
    },
    [inputKind, sentenceDone],
  )

  const sentenceCompleteRef = useRef(sentenceComplete)
  sentenceCompleteRef.current = sentenceComplete

  const keyboardActions = useMemo(
    () => ({
      onCtrlHint,
      onNext: () => {
        if (sentenceCompleteRef.current) goNextSentence()
      },
      onSkip: handleSkip,
    }),
    [goNextSentence, handleSkip, onCtrlHint],
  )

  useWritingKeyboardShortcuts(ready && !allDone && !sentenceDone, keyboardActions)

  if (!ready || !current) {
    return (
      <div className={vocabLessonPanelClass}>
        <p className="m-0 font-body text-sm text-[var(--dlx-muted)]">Đang tải bài học…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-4">
      <div className={vocabLessonPanelClass}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--dlx-hairline)] pb-4">
          <div>
            <p className="m-0 font-body text-xs font-semibold uppercase tracking-wide text-[var(--dlx-muted)]">
              Luyện viết · {lesson.level} · {lesson.title}
            </p>
            <p className="mt-1 mb-0 font-body text-sm font-semibold text-[var(--dlx-ink)]">
              Câu {sentenceIndex + 1} / {total}
            </p>
          </div>
          <div className="min-w-[7rem] text-right">
            <p className="m-0 font-body text-xs font-semibold text-[var(--dlx-muted)]">{progressPct}%</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--dlx-neutral-1)]">
              <div
                className="h-full rounded-full bg-[var(--dlx-primary)] transition-[width]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-5">
          <section>
            <p className={vocabFlowKickerClass}>
              <MessageSquare className="size-3.5" aria-hidden />
              Câu tiếng Việt
            </p>
            <p className="mt-3 mb-0 font-heading text-xl font-bold leading-snug text-[var(--dlx-ink)] sm:text-2xl">
              {current.vi}
            </p>
          </section>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={vocabFlowKickerClass}>
                <PencilLine className="size-3.5" aria-hidden />
                Câu trả lời
              </p>
              {scriptModes.length > 0 ? (
                <WritingScriptModeSwitch
                  modes={scriptModes}
                  value={scriptModeId}
                  onChange={setScriptModeId}
                />
              ) : null}
            </div>
            <div className="mt-3 rounded-xl border border-[var(--dlx-hairline)] bg-[color-mix(in_srgb,var(--dlx-neutral-1)_55%,#fff)] p-4">
              <WritingBlankInput
                key={`${sentenceIndex}-${scriptModeId}`}
                target={currentTarget}
                value={draft}
                onChange={handleDraftChange}
                onComplete={handleComplete}
                disabled={sentenceDone}
                hintWordRange={hintWordRange}
                inputKind={inputKind}
                lexiconWords={lexiconWords}
              />
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-[var(--dlx-hairline)] pt-5">
          <Button type="button" variant="outline" onClick={handleSkip} disabled={sentenceIndex >= total - 1}>
            Bỏ qua
          </Button>
          <button
            type="button"
            className={vocabFlowPrimaryButtonClass}
            disabled={!sentenceComplete}
            onClick={goNextSentence}
          >
            {sentenceIndex >= total - 1 ? "Hoàn thành câu" : "Câu tiếp"}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {allDone ? (
        <div className={vocabLessonPanelClass}>
          <p className="m-0 font-heading text-lg font-bold text-[var(--dlx-ink)]">Hoàn thành bài học</p>
          <p className="mt-2 mb-0 font-body text-sm text-[var(--dlx-body)]">
            Bạn đã luyện xong {total} câu. Tiến độ đã được lưu — lần sau mở lại sẽ tiếp tục từ chỗ dở nếu chưa xong.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
              Quay lại danh sách
            </Link>
            {nextLessonHref ? (
              <Link href={nextLessonHref} className={vocabFlowPrimaryButtonClass}>
                Bài tiếp theo
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
