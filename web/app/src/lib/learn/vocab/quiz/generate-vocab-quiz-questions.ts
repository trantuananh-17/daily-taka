import { shuffleSeeded } from "@/lib/learn/shuffle-seeded"
import type { VocabQuizQuestion, VocabWord } from "@/lib/learn/vocab/types/lesson-story"

function pickDistractors(word: VocabWord, pool: VocabWord[], count: number, seed: string): string[] {
  const fromWord = word.distractors.filter(Boolean)
  const fromOthers = pool
    .filter((row) => row.id !== word.id)
    .flatMap((row) => [row.meaningVi, row.term])
  const merged = shuffleSeeded([...fromWord, ...fromOthers], `${seed}:distractors:${word.id}`)
  return merged.slice(0, count)
}

function withOptions(
  correct: string,
  distractors: string[],
  seed: string,
  count = 4,
): { options: string[]; correctIndex: number } {
  const unique = shuffleSeeded(
    [correct, ...distractors.filter((d) => d !== correct)],
    `${seed}:options:${correct}`,
  ).slice(0, count)
  while (unique.length < count) unique.push(`${correct} (${unique.length})`)
  const options = unique.slice(0, count)
  return { options, correctIndex: options.indexOf(correct) }
}

function clozeExample(example: string, term: string): string {
  const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
  if (re.test(example)) return example.replace(re, "______")
  return `${example.replace(/\.$/, "")} ______.`
}

type GenerateVocabQuizOptions = {
  /** Stable seed (e.g. lesson story id). Required for shuffled options. */
  seed: string
  distractorPool?: VocabWord[]
}

/** One mixed question per word; option order shuffled deterministically from `seed`. */
export function generateVocabQuizQuestions(
  words: VocabWord[],
  options: GenerateVocabQuizOptions,
): VocabQuizQuestion[] {
  const { seed, distractorPool } = options
  const pool = distractorPool ?? words
  const questions: VocabQuizQuestion[] = []

  words.forEach((word, index) => {
    const typeCycle: VocabQuizQuestion["type"][] = [
      "meaningChoice",
      "listenChoice",
      "clozeChoice",
      "termFromMeaning",
    ]
    const type = typeCycle[index % typeCycle.length]
    const wordSeed = `${seed}:${word.id}:${index}`

    if (type === "meaningChoice") {
      const { options: opts, correctIndex } = withOptions(
        word.meaningVi,
        pickDistractors(word, pool, 3, wordSeed),
        wordSeed,
      )
      questions.push({
        id: `${word.id}-meaning`,
        type,
        wordId: word.id,
        prompt: `“${word.term}” có nghĩa là gì?`,
        options: opts,
        correctIndex,
        example: word.example,
        exampleVi: word.exampleVi,
      })
      return
    }

    if (type === "listenChoice") {
      const terms = shuffleSeeded(
        pool.filter((w) => w.id !== word.id).map((w) => w.term),
        `${wordSeed}:listen-terms`,
      ).slice(0, 3)
      const { options: opts, correctIndex } = withOptions(word.term, terms, wordSeed)
      questions.push({
        id: `${word.id}-listen`,
        type,
        wordId: word.id,
        prompt: "Nghe và chọn từ tiếng Anh bạn vừa nghe",
        options: opts,
        correctIndex,
        example: word.example,
        exampleVi: word.exampleVi,
      })
      return
    }

    if (type === "clozeChoice") {
      const terms = shuffleSeeded(
        pool.filter((w) => w.id !== word.id).map((w) => w.term),
        `${wordSeed}:cloze-terms`,
      ).slice(0, 3)
      const { options: opts, correctIndex } = withOptions(word.term, terms, wordSeed)
      questions.push({
        id: `${word.id}-cloze`,
        type,
        wordId: word.id,
        prompt: clozeExample(word.example, word.term),
        options: opts,
        correctIndex,
        example: word.example,
        exampleVi: word.exampleVi,
      })
      return
    }

    const terms = shuffleSeeded(
      pool.filter((w) => w.id !== word.id).map((w) => w.term),
      `${wordSeed}:reverse-terms`,
    ).slice(0, 3)
    const { options: opts, correctIndex } = withOptions(word.term, terms, wordSeed)
    questions.push({
      id: `${word.id}-reverse`,
      type: "termFromMeaning",
      wordId: word.id,
      prompt: `Từ tiếng Anh nào có nghĩa “${word.meaningVi}”?`,
      options: opts,
      correctIndex,
      example: word.example,
      exampleVi: word.exampleVi,
    })
  })

  return questions
}
