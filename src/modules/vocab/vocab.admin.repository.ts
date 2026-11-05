import { and, asc, eq } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import {
  vocabCurricula,
  vocabLessons,
  vocabTopics,
  vocabWords,
} from "../../db/schema/vocab"
import type { VocabLanguageCode } from "./vocab.constants"
import { normalizeVocabLevelCode } from "./vocab.constants"
import type { UpsertVocabWordsInput, UpdateVocabLessonInput } from "./vocab.admin.dto"

export class VocabAdminRepository {
  constructor(private readonly db: DbExecutor) {}

  async findCurriculum(languageCode: VocabLanguageCode, levelCode: string) {
    const normalized = normalizeVocabLevelCode(levelCode)
    const rows = await this.db
      .select()
      .from(vocabCurricula)
      .where(
        and(
          eq(vocabCurricula.languageCode, languageCode),
          eq(vocabCurricula.levelCode, normalized),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async listTopicsWithLessons(curriculumId: string) {
    const topics = await this.db
      .select()
      .from(vocabTopics)
      .where(eq(vocabTopics.curriculumId, curriculumId))
      .orderBy(asc(vocabTopics.sortOrder))

    const lessons = await this.db
      .select()
      .from(vocabLessons)
      .where(eq(vocabLessons.curriculumId, curriculumId))
      .orderBy(asc(vocabLessons.sortOrder))

    const byTopic = new Map<string, typeof lessons>()
    for (const lesson of lessons) {
      const list = byTopic.get(lesson.topicId) ?? []
      list.push(lesson)
      byTopic.set(lesson.topicId, list)
    }

    return topics.map((topic) => ({ topic, lessons: byTopic.get(topic.id) ?? [] }))
  }

  async findLessonById(lessonId: string) {
    const rows = await this.db.select().from(vocabLessons).where(eq(vocabLessons.id, lessonId)).limit(1)
    return rows[0] ?? null
  }

  async listWordsByLesson(lessonId: string) {
    return this.db
      .select()
      .from(vocabWords)
      .where(eq(vocabWords.lessonId, lessonId))
      .orderBy(asc(vocabWords.sortOrder))
  }

  async updateLesson(lessonId: string, patch: UpdateVocabLessonInput) {
    const rows = await this.db
      .update(vocabLessons)
      .set(patch)
      .where(eq(vocabLessons.id, lessonId))
      .returning()
    return rows[0] ?? null
  }

  async replaceLessonWords(lessonId: string, input: UpsertVocabWordsInput) {
    await this.db.delete(vocabWords).where(eq(vocabWords.lessonId, lessonId))

    if (input.words.length === 0) return []

    const rows = input.words.map((word, index) => ({
      id: word.id ?? `${lessonId}:${word.slug}`,
      lessonId,
      slug: word.slug,
      term: word.term,
      ipa: word.ipa ?? "",
      partOfSpeech: word.partOfSpeech,
      meaningVi: word.meaningVi,
      definition: word.definition,
      example: word.example,
      exampleVi: word.exampleVi,
      collocations: word.collocations ?? [],
      distractors: word.distractors ?? [],
      sortOrder: word.sortOrder ?? index + 1,
    }))

    await this.db.insert(vocabWords).values(rows)

    await this.db
      .update(vocabLessons)
      .set({ wordCount: rows.length })
      .where(eq(vocabLessons.id, lessonId))

    return this.listWordsByLesson(lessonId)
  }
}
