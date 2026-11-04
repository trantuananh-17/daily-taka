"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { VocabFlashcardPanel } from "@/features/vocab/lesson/vocab-flashcard-panel"
import { VocabQuizQuestionPanel } from "@/features/vocab/lesson/vocab-quiz-question-panel"
import { generateVocabQuizQuestions } from "@/lib/learn/vocab/quiz/generate-vocab-quiz-questions"
import { speakVocabTerm } from "@/lib/learn/vocab/speak-vocab-term"
import type { VocabWord } from "@/lib/learn/vocab/types/lesson-story"

export type VocabQuickReviewStep = {
  word: VocabWord
  kind: "flashcard" | "quiz"
}

type VocabQuickReviewPanelProps = {
  steps: VocabQuickReviewStep[]
  lessonWords: VocabWord[]
  carriedCount: number
  isCarriedWord: (wordId: string) => boolean
  onReviewAgain: (wordId: string) => void
  onReviewRemembered: (wordId: string) => void
  onQuizCorrect: (wordId: string) => void
  onQuizWrong: (wordId: string) => void
  onComplete: () => void
  onProgressChange?: (current: number, total: number) => void
}

export function VocabQuickReviewPanel({
  steps,
  lessonWords,
  carriedCount,
  isCarriedWord,
  onReviewAgain,
  onReviewRemembered,
  onQuizCorrect,
  onQuizWrong,
  onComplete,
  onProgressChange,
}: VocabQuickReviewPanelProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [quizSelected, setQuizSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const stepTotal = steps.length
  const stepCurrent = finished ? stepTotal : Math.min(stepIndex + 1, stepTotal)
  const progressDisplay = stepTotal > 0 ? { current: stepCurrent, total: stepTotal } : undefined

  const current = steps[stepIndex]
  const cardStepsBefore = useMemo(
    () => steps.slice(0, stepIndex + 1).filter((s) => s.kind === "flashcard").length,
    [steps, stepIndex],
  )

  const distractorPool = useMemo(() => {
    const byId = new Map<string, VocabWord>()
    for (const w of lessonWords) byId.set(w.id, w)
    for (const s of steps) byId.set(s.word.id, s.word)
    return [...byId.values()]
  }, [lessonWords, steps])

  const quizByWordId = useMemo(() => {
    const uniqueWords = [...new Map(steps.map((s) => [s.word.id, s.word])).values()]
    const questions = generateVocabQuizQuestions(uniqueWords, { distractorPool })
    return new Map(questions.map((q) => [q.wordId, q]))
  }, [steps, distractorPool])

  useEffect(() => {
    setRevealed(false)
    setQuizSelected(null)
  }, [stepIndex, current?.word.id, current?.kind])

  useEffect(() => {
    if (current?.kind === "quiz") {
      const q = quizByWordId.get(current.word.id)
      if (q?.type === "listenChoice") speakVocabTerm(current.word.term)
    }
  }, [current, quizByWordId])

  useEffect(() => {
    if (!onProgressChange || stepTotal === 0) return
    onProgressChange(stepCurrent, stepTotal)
  }, [stepCurrent, stepTotal, onProgressChange])

  function goNext() {
    if (stepIndex + 1 >= stepTotal) {
      setFinished(true)
      return
    }
    setStepIndex((i) => i + 1)
  }

  function handleQuizSelect(optionIndex: number) {
    if (quizSelected !== null || !current || current.kind !== "quiz") return
    const question = quizByWordId.get(current.word.id)
    if (!question) return
    setQuizSelected(optionIndex)
    if (optionIndex === question.correctIndex) onQuizCorrect(current.word.id)
    else onQuizWrong(current.word.id)
  }

  const question = current?.kind === "quiz" ? quizByWordId.get(current.word.id) : undefined

  return (
    <div>
      <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--dlx-primary)]">Ôn nhanh</p>
      <h2 className="mt-1 mb-0 font-heading text-lg font-bold text-[var(--dlx-ink)]">Củng cố từ còn yếu</h2>
      {carriedCount > 0 ? (
        <p className="mt-1 font-body text-sm text-[var(--dlx-muted)]">{carriedCount} từ từ bài trước.</p>
      ) : null}

      {!finished && current?.kind === "flashcard" ? (
        <div className="mt-4">
          <VocabFlashcardPanel
            word={current.word}
            index={Math.max(0, cardStepsBefore - 1)}
            total={steps.filter((s) => s.kind === "flashcard").length}
            progressDisplay={progressDisplay}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
            onAgain={() => {
              onReviewAgain(current.word.id)
              goNext()
            }}
            onRemembered={() => {
              if (isCarriedWord(current.word.id)) onReviewRemembered(current.word.id)
              goNext()
            }}
          />
        </div>
      ) : null}

      {!finished && current?.kind === "quiz" && question ? (
        <div className="mt-4">
          <VocabQuizQuestionPanel
            question={question}
            index={0}
            total={1}
            selected={quizSelected}
            onSelect={handleQuizSelect}
            onNext={goNext}
            words={distractorPool}
            heading="Ôn nhanh · Quiz xác nhận"
            progressDisplay={progressDisplay}
            doneNextLabel={stepIndex + 1 >= stepTotal ? "Hoàn thành ôn nhanh" : "Tiếp theo"}
          />
        </div>
      ) : null}

      {finished ? (
        <div className="mt-6 py-4 text-center">
          <p className="m-0 font-body text-sm text-[var(--dlx-body)]">Bạn đã xong ôn nhanh cho bài này.</p>
          <Button type="button" className="dlx-btn-primary mt-4" onClick={onComplete}>
            Xem kết quả bài học →
          </Button>
        </div>
      ) : null}
    </div>
  )
}
