import type { VocabQuizQuestion, VocabWord } from "@/lib/learn/vocab/types/lesson-story"

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickDistractors(word: VocabWord, pool: VocabWord[], count: number): string[] {
  const fromWord = word.distractors.filter(Boolean)
  const fromOthers = pool
    .filter((row) => row.id !== word.id)
    .flatMap((row) => [row.meaningVi, row.term])
  const merged = shuffle([...fromWord, ...fromOthers])
  return merged.slice(0, count)
}

function withOptions(correct: string, distractors: string[], count = 4): { options: string[]; correctIndex: number } {
  const unique = shuffle([correct, ...distractors.filter((d) => d !== correct)]).slice(0, count)
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
  /** Wrong-option pool (defaults to `words`). Use full lesson words when `words` is a weak subset. */
  distractorPool?: VocabWord[]
}

/** Builds one mixed question per word (deterministic order, shuffled options). */
export function generateVocabQuizQuestions(
  words: VocabWord[],
  options?: GenerateVocabQuizOptions,
): VocabQuizQuestion[] {
  const pool = options?.distractorPool ?? words
  const questions: VocabQuizQuestion[] = []

  words.forEach((word, index) => {
    const typeCycle: VocabQuizQuestion["type"][] = [
      "meaningChoice",
      "listenChoice",
      "clozeChoice",
      "termFromMeaning",
    ]
    const type = typeCycle[index % typeCycle.length]

    if (type === "meaningChoice") {
      const { options, correctIndex } = withOptions(
        word.meaningVi,
        pickDistractors(word, pool, 3),
      )
      questions.push({
        id: `${word.id}-meaning`,
        type,
        wordId: word.id,
        prompt: `“${word.term}” có nghĩa là gì?`,
        options,
        correctIndex,
        example: word.example,
        exampleVi: word.exampleVi,
      })
      return
    }

    if (type === "listenChoice") {
      const { options, correctIndex } = withOptions(
        word.term,
        shuffle(pool.filter((w) => w.id !== word.id).map((w) => w.term)).slice(0, 3),
      )
      questions.push({
        id: `${word.id}-listen`,
        type,
        wordId: word.id,
        prompt: "Nghe và chọn từ tiếng Anh bạn vừa nghe",
        options,
        correctIndex,
        example: word.example,
        exampleVi: word.exampleVi,
      })
      return
    }

    if (type === "clozeChoice") {
      const { options, correctIndex } = withOptions(
        word.term,
        shuffle(pool.filter((w) => w.id !== word.id).map((w) => w.term)).slice(0, 3),
      )
      questions.push({
        id: `${word.id}-cloze`,
        type,
        wordId: word.id,
        prompt: clozeExample(word.example, word.term),
        options,
        correctIndex,
        example: word.example,
        exampleVi: word.exampleVi,
      })
      return
    }

    const { options, correctIndex } = withOptions(
      word.term,
      shuffle(pool.filter((w) => w.id !== word.id).map((w) => w.term)).slice(0, 3),
    )
    questions.push({
      id: `${word.id}-reverse`,
      type: "termFromMeaning",
      wordId: word.id,
      prompt: `Từ tiếng Anh nào có nghĩa “${word.meaningVi}”?`,
      options,
      correctIndex,
      example: word.example,
      exampleVi: word.exampleVi,
    })
  })

  return questions
}
