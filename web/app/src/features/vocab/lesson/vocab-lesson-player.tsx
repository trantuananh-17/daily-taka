"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"
import { VocabFlashcardPanel } from "@/features/vocab/lesson/vocab-flashcard-panel"
import { VocabLessonPanel, VocabLessonShell } from "@/features/vocab/lesson/vocab-lesson-panel"
import { SpeakButton } from "@/features/vocab/lesson/speak-button"
import { VocabMatchingPanel } from "@/features/vocab/lesson/vocab-matching-panel"
import { VocabLessonOverview } from "@/features/vocab/lesson/vocab-lesson-overview"
import { VocabLessonStepper } from "@/features/vocab/lesson/vocab-lesson-stepper"
import {
  VocabQuickReviewPanel,
  type VocabQuickReviewStep,
} from "@/features/vocab/lesson/vocab-quick-review-panel"
import { VocabQuizQuestionPanel } from "@/features/vocab/lesson/vocab-quiz-question-panel"
import { generateVocabQuizQuestions } from "@/lib/learn/vocab/quiz/generate-vocab-quiz-questions"
import { speakVocabTerm } from "@/lib/learn/vocab/speak-vocab-term"
import type { VocabLessonStep, VocabLessonStory, VocabWord } from "@/lib/learn/vocab/types/lesson-story"
import {
  loadCarriedWeakWords,
  saveCarriedWeakWordsForLesson,
  toCarriedWeakWord,
  type CarriedWeakWord,
} from "@/lib/learn/vocab/weak-word-carry"

type LessonFinalStats = {
  correct: number
  questionTotal: number
  mastered: number
}

function carriedToVocabWord(c: CarriedWeakWord): VocabWord {
  return { ...c, collocations: [], distractors: [] }
}

type VocabLessonPlayerProps = {
  story: VocabLessonStory
  backHref: string
  nextLessonHref: string | null
  /** Ẩn marketing header/nav khi đang học (không phải overview). */
  onFocusModeChange?: (focused: boolean, learningInProgress: boolean) => void
}

const STEP_LABEL: Record<VocabLessonStep, string> = {
  overview: "Tổng quan bài học",
  intro: "Làm quen với từ mới",
  flashcard: "Flashcard",
  matching: "Ghép thẻ",
  quiz: "Quiz",
  review: "Ôn nhanh",
  lessonComplete: "Hoàn thành",
}

export function VocabLessonPlayer({ story, backHref, nextLessonHref, onFocusModeChange }: VocabLessonPlayerProps) {
  const words = story.words
  const total = words.length

  const [step, setStep] = useState<VocabLessonStep>("overview")

  const learningInProgress =
    step !== "overview" && step !== "lessonComplete"

  useEffect(() => {
    onFocusModeChange?.(step !== "overview", learningInProgress)
  }, [step, learningInProgress, onFocusModeChange])
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => new Set())
  const [weakWordIds, setWeakWordIds] = useState<Set<string>>(() => new Set())
  /** Flashcard “Học lại” / ghép thẻ sai → ôn nhanh gồm flashcard + quiz. */
  const [flashcardReviewIds, setFlashcardReviewIds] = useState<Set<string>>(() => new Set())
  const [carriedWeak] = useState(() => loadCarriedWeakWords(story.id))
  const [finalStats, setFinalStats] = useState<LessonFinalStats | null>(null)

  const [flashIndex, setFlashIndex] = useState(0)
  const [flashRevealed, setFlashRevealed] = useState(false)
  const [flashRemembered, setFlashRemembered] = useState(0)
  const [flashAgain, setFlashAgain] = useState(0)
  const [flashDone, setFlashDone] = useState(false)

  const [matchProgress, setMatchProgress] = useState(0)

  const quizQuestions = useMemo(() => generateVocabQuizQuestions(words), [words])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizSelected, setQuizSelected] = useState<number | null>(null)
  const [quizCorrectCount, setQuizCorrectCount] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  const [clearedCarriedIds, setClearedCarriedIds] = useState<Set<string>>(() => new Set())
  const [reviewProgress, setReviewProgress] = useState({ current: 0, total: 1 })

  /** Quiz-correct only — drives “Tiến độ toàn bài / đã thành thạo”. */
  const markQuizMastered = useCallback((id: string) => {
    setMasteredIds((prev) => new Set(prev).add(id))
  }, [])

  const addFlashcardReview = useCallback((wordId: string) => {
    setFlashcardReviewIds((prev) => new Set(prev).add(wordId))
    setWeakWordIds((prev) => new Set(prev).add(wordId))
  }, [])

  const addQuizOnlyWeak = useCallback((wordId: string) => {
    setWeakWordIds((prev) => new Set(prev).add(wordId))
  }, [])

  const reviewWords = useMemo(() => {
    const seen = new Set<string>()
    const list: VocabWord[] = []
    for (const c of carriedWeak) {
      if (clearedCarriedIds.has(c.id) || seen.has(c.id)) continue
      seen.add(c.id)
      list.push(carriedToVocabWord(c))
    }
    for (const w of words) {
      if (weakWordIds.has(w.id) && !seen.has(w.id)) {
        seen.add(w.id)
        list.push(w)
      }
    }
    return list
  }, [carriedWeak, clearedCarriedIds, words, weakWordIds])

  const activityProgress = useMemo(() => {
    switch (step) {
      case "intro":
        return 0
      case "flashcard":
        return flashDone ? total : flashIndex
      case "matching":
        return matchProgress
      case "quiz":
        return quizDone ? total : quizIndex
      case "review":
        return reviewProgress.current
      default:
        return 0
    }
  }, [step, flashDone, flashIndex, matchProgress, quizDone, quizIndex, reviewProgress.current, total])

  const stepLabel = STEP_LABEL[step]

  const carriedInReviewCount = useMemo(
    () => reviewWords.filter((w) => carriedWeak.some((c) => c.id === w.id)).length,
    [reviewWords, carriedWeak],
  )

  const reviewSteps = useMemo((): VocabQuickReviewStep[] => {
    const steps: VocabQuickReviewStep[] = []
    for (const word of reviewWords) {
      const needsFlashcard =
        flashcardReviewIds.has(word.id) ||
        carriedWeak.some((c) => c.id === word.id && !clearedCarriedIds.has(c.id))
      if (needsFlashcard) steps.push({ word, kind: "flashcard" })
    }
    for (const word of reviewWords) {
      steps.push({ word, kind: "quiz" })
    }
    return steps
  }, [reviewWords, flashcardReviewIds, carriedWeak, clearedCarriedIds])

  const handleMatchProgress = useCallback((matched: number, _total: number) => {
    setMatchProgress(matched)
  }, [])

  const buildCarryPayload = useCallback((): CarriedWeakWord[] => {
    const byId = new Map<string, CarriedWeakWord>()
    for (const c of carriedWeak) {
      if (!clearedCarriedIds.has(c.id)) byId.set(c.id, c)
    }
    for (const w of words) {
      if (weakWordIds.has(w.id)) byId.set(w.id, toCarriedWeakWord(w))
    }
    return [...byId.values()]
  }, [carriedWeak, clearedCarriedIds, weakWordIds, words])

  const handleReviewProgress = useCallback((current: number, total: number) => {
    setReviewProgress({ current, total })
  }, [])

  const persistWeakCarryForNextLesson = useCallback(() => {
    const nextId = story.nextStory?.id
    if (!nextId) return
    saveCarriedWeakWordsForLesson(nextId, buildCarryPayload())
  }, [buildCarryPayload, story.nextStory?.id])

  const currentWord = words[flashIndex]

  useEffect(() => {
    if (step === "quiz" && quizQuestions[quizIndex]?.type === "listenChoice") {
      const w = words.find((row) => row.id === quizQuestions[quizIndex]?.wordId)
      if (w) speakVocabTerm(w.term)
    }
  }, [step, quizIndex, quizQuestions, words])

  useEffect(() => {
    if (step !== "quiz" || !quizDone) return
    setFinalStats({
      correct: quizCorrectCount,
      questionTotal: quizQuestions.length,
      mastered: masteredIds.size,
    })
  }, [step, quizDone, quizCorrectCount, quizQuestions.length, masteredIds.size])

  useEffect(() => {
    setFlashRevealed(false)
  }, [flashIndex])

  function handleQuizAnswer(optionIndex: number) {
    if (quizSelected !== null || quizDone) return
    const q = quizQuestions[quizIndex]
    if (!q) return
    setQuizSelected(optionIndex)
    const correct = optionIndex === q.correctIndex
    if (correct) {
      setQuizCorrectCount((c) => c + 1)
      markQuizMastered(q.wordId)
    } else {
      addQuizOnlyWeak(q.wordId)
    }
  }

  function nextQuizQuestion() {
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizDone(true)
      return
    }
    setQuizIndex((i) => i + 1)
    setQuizSelected(null)
  }

  function finishLessonComplete() {
    persistWeakCarryForNextLesson()
    setStep("lessonComplete")
  }

  function afterMainQuizContinue() {
    if (weakWordIds.size === 0 && reviewWords.length === 0) {
      finishLessonComplete()
      return
    }
    const total = Math.max(1, reviewSteps.length)
    setReviewProgress({ current: 1, total })
    setStep("review")
  }

  if (step === "overview") {
    return (
      <VocabLessonShell>
        <VocabLessonOverview
          story={story}
          totalWords={total}
          masteredCount={masteredIds.size}
          onStart={() => setStep("intro")}
        />
      </VocabLessonShell>
    )
  }

  if (step === "lessonComplete") {
    const stats = finalStats ?? {
      correct: quizCorrectCount,
      questionTotal: quizQuestions.length,
      mastered: masteredIds.size,
    }
    const accuracy =
      stats.questionTotal > 0 ? Math.round((stats.correct / stats.questionTotal) * 100) : 0
    const noWeakLeft = buildCarryPayload().length === 0
    return (
      <VocabLessonShell>
        <VocabLessonPanel className="p-8 text-center">
          <Trophy className="mx-auto size-10 text-[var(--dlx-accent-4)]" strokeWidth={2} aria-hidden />
          <h2 className="mt-4 mb-2 font-heading text-2xl font-extrabold text-[var(--dlx-ink)]">
            Hoàn thành bài học!
          </h2>
          <p className="m-0 font-body text-sm text-[var(--dlx-body)]">
            Bạn đã đi hết toàn bộ các batch của bài học.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[color-mix(in_srgb,var(--dlx-primary)_12%,#fff)] p-3">
              <p className="m-0 font-heading text-lg font-bold text-[var(--dlx-primary)]">
                {stats.mastered}/{total}
              </p>
              <p className="m-0 text-xs text-[var(--dlx-muted)]">từ</p>
            </div>
            <div className="rounded-xl bg-[color-mix(in_srgb,var(--dlx-primary)_12%,#fff)] p-3">
              <p className="m-0 font-heading text-lg font-bold text-[var(--dlx-primary)]">{accuracy}%</p>
              <p className="m-0 text-xs text-[var(--dlx-muted)]">Độ chính xác</p>
            </div>
            <div className="rounded-xl bg-[color-mix(in_srgb,var(--dlx-primary)_12%,#fff)] p-3">
              <p className="m-0 font-heading text-lg font-bold text-[var(--dlx-primary)]">{stats.mastered}</p>
              <p className="m-0 text-xs text-[var(--dlx-muted)]">đã thành thạo</p>
            </div>
          </div>
          <p className="mt-4 inline-flex items-center gap-1 font-body text-sm text-[var(--dlx-primary)]">
            <CheckCircle2 className="size-4" aria-hidden />
            {noWeakLeft ? "Không còn từ yếu." : "Một số từ yếu sẽ được ôn ở bài sau."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("overview")}>
              Học lại
            </Button>
            {nextLessonHref ? (
              <Link
                href={nextLessonHref}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "dlx-btn-primary inline-flex min-w-[11rem] flex-col items-center gap-0.5 px-5 py-2.5",
                )}
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  Bài tiếp theo
                  <ArrowRight className="size-4" aria-hidden />
                </span>
                {story.nextStory ? (
                  <span className="max-w-[16rem] truncate text-center text-[12px] font-normal leading-snug opacity-90">
                    {story.nextStory.title}
                  </span>
                ) : null}
              </Link>
            ) : (
              <Link href={backHref} className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4")}>
                Về danh sách
              </Link>
            )}
          </div>
        </VocabLessonPanel>
      </VocabLessonShell>
    )
  }

  return (
    <VocabLessonShell>
      <VocabLessonStepper
        activeStep={step}
        stepLabel={stepLabel}
        masteredCount={masteredIds.size}
        totalWords={total}
        activityProgress={activityProgress}
        activityTotal={step === "review" ? reviewProgress.total : total}
      />

      {step === "intro" ? (
        <VocabLessonPanel>
          <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--dlx-primary)]">Batch 1/1</p>
          <h2 className="mt-1 mb-1 font-heading text-xl font-bold text-[var(--dlx-ink)]">Làm quen với từ mới</h2>
          <p className="m-0 mb-4 font-body text-sm text-[var(--dlx-muted)]">
            Xem nhanh các từ trong batch trước khi bắt đầu flashcard.
          </p>
          <ul className="m-0 list-none divide-y divide-border p-0">
            {words.map((word, index) => (
              <li key={word.id}>
                <div className="flex items-center gap-3 py-3">
                  <span className="w-5 shrink-0 text-center font-body text-xs font-semibold tabular-nums text-[var(--dlx-muted)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                      <span className="font-heading text-base font-bold text-[var(--dlx-ink)]">{word.term}</span>
                      <span className="font-body text-sm text-[var(--dlx-muted)]">{word.ipa}</span>
                    </div>
                    <p className="m-0 mt-0.5 font-body text-sm text-[var(--dlx-body)]">{word.meaningVi}</p>
                  </div>
                  <SpeakButton term={word.term} className="shrink-0" label="" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <Button type="button" className="dlx-btn-primary gap-2" onClick={() => setStep("flashcard")}>
              Bắt đầu flashcard
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </VocabLessonPanel>
      ) : null}

      {step === "flashcard" ? (
        <VocabLessonPanel>
          {flashDone ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-[var(--dlx-primary)]" aria-hidden />
              <h3 className="mt-4 font-heading text-xl font-bold text-[var(--dlx-ink)]">Tốt lắm!</h3>
              <p className="font-body text-sm text-[var(--dlx-body)]">Bạn đã xem hết flashcard của batch này.</p>
              <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="rounded-xl bg-[color-mix(in_srgb,#16a34a_12%,#fff)] p-3 text-[#15803d]">
                  {flashRemembered} đã nhớ
                </div>
                <div className="rounded-xl bg-[color-mix(in_srgb,#dc2626_10%,#fff)] p-3 text-[#b91c1c]">
                  {flashAgain} cần luyện thêm
                </div>
              </div>
              <Button type="button" className="dlx-btn-primary mt-6 gap-2" onClick={() => setStep("matching")}>
                Bắt đầu ghép thẻ
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          ) : currentWord ? (
            <VocabFlashcardPanel
              word={currentWord}
              index={flashIndex}
              total={total}
              revealed={flashRevealed}
              onReveal={() => setFlashRevealed(true)}
              onAgain={() => {
                addFlashcardReview(currentWord.id)
                setFlashAgain((c) => c + 1)
                if (flashIndex + 1 >= total) setFlashDone(true)
                else setFlashIndex((i) => i + 1)
              }}
              onRemembered={() => {
                setFlashRemembered((c) => c + 1)
                if (flashIndex + 1 >= total) setFlashDone(true)
                else setFlashIndex((i) => i + 1)
              }}
            />
          ) : null}
        </VocabLessonPanel>
      ) : null}

      {step === "matching" ? (
        <VocabLessonPanel>
          <VocabMatchingPanel
            words={words}
            onProgress={handleMatchProgress}
            onWeakWord={addFlashcardReview}
            onContinue={() => setStep("quiz")}
          />
        </VocabLessonPanel>
      ) : null}

      {step === "quiz" ? (
        <VocabLessonPanel>
          {quizDone ? (
            <div className="py-6 text-center">
              <Trophy className="mx-auto size-10 text-[var(--dlx-accent-4)]" aria-hidden />
              <h3 className="mt-3 font-heading text-xl font-bold">Hoàn thành quiz</h3>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-green-50 p-2 text-sm">
                  {quizCorrectCount}/{quizQuestions.length} Điểm
                </div>
                <div className="rounded-lg bg-green-50 p-2 text-sm">
                  {Math.round((quizCorrectCount / quizQuestions.length) * 100)}% Độ chính xác
                </div>
                <div className="rounded-lg bg-red-50 p-2 text-sm">
                  {quizQuestions.length - quizCorrectCount} Chưa đúng
                </div>
              </div>
              <Button type="button" className="dlx-btn-primary mt-6" onClick={afterMainQuizContinue}>
                Hoàn thành →
              </Button>
            </div>
          ) : (
            <VocabQuizQuestionPanel
              question={quizQuestions[quizIndex]}
              index={quizIndex}
              total={quizQuestions.length}
              selected={quizSelected}
              onSelect={handleQuizAnswer}
              onNext={nextQuizQuestion}
              words={words}
              heading="QUIZ"
            />
          )}
        </VocabLessonPanel>
      ) : null}

      {step === "review" ? (
        <VocabLessonPanel>
          {reviewWords.length === 0 ? (
            <div className="py-6 text-center">
              <p className="font-body text-sm text-[var(--dlx-body)]">Không có từ cần ôn.</p>
              <Button type="button" className="dlx-btn-primary mt-4" onClick={finishLessonComplete}>
                Kết thúc bài học →
              </Button>
            </div>
          ) : (
            <VocabQuickReviewPanel
              key={reviewSteps.map((s) => `${s.kind}:${s.word.id}`).join(",")}
              steps={reviewSteps}
              lessonWords={words}
              carriedCount={carriedInReviewCount}
              isCarriedWord={(id) => carriedWeak.some((c) => c.id === id)}
              onReviewAgain={addFlashcardReview}
              onReviewRemembered={(id) => {
                if (carriedWeak.some((c) => c.id === id)) {
                  setClearedCarriedIds((prev) => new Set(prev).add(id))
                }
              }}
              onQuizCorrect={(wordId) => {
                setWeakWordIds((prev) => {
                  const next = new Set(prev)
                  next.delete(wordId)
                  return next
                })
              }}
              onQuizWrong={addQuizOnlyWeak}
              onComplete={finishLessonComplete}
              onProgressChange={handleReviewProgress}
            />
          )}
        </VocabLessonPanel>
      ) : null}
    </VocabLessonShell>
  )
}
