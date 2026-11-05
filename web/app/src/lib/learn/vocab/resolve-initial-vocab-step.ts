import type { VocabLessonStep, VocabLessonStory } from "@/lib/learn/vocab/types/lesson-story"

const STEPS: VocabLessonStep[] = [
  "overview",
  "intro",
  "flashcard",
  "matching",
  "quiz",
  "review",
  "lessonComplete",
]

export function resolveInitialVocabStep(story: VocabLessonStory): VocabLessonStep {
  const progress = story.lessonProgress
  if (!progress) return "overview"
  if (progress.isCompleted || progress.status === "completed") return "lessonComplete"
  if (STEPS.includes(progress.currentStep as VocabLessonStep)) {
    return progress.currentStep as VocabLessonStep
  }
  return "overview"
}
