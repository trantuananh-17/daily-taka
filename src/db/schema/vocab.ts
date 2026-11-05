import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { user } from "./auth"
import { languages } from "./languages"

export const vocabCurricula = pgTable(
  "vocab_curricula",
  {
    id: text("id").primaryKey(),
    languageCode: text("language_code")
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    levelCode: text("level_code").notNull(),
    title: text("title"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [
    uniqueIndex("vocab_curricula_language_level_idx").on(table.languageCode, table.levelCode),
  ],
)

export const vocabTopics = pgTable(
  "vocab_topics",
  {
    id: text("id").primaryKey(),
    curriculumId: text("curriculum_id")
      .notNull()
      .references(() => vocabCurricula.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [uniqueIndex("vocab_topics_curriculum_slug_idx").on(table.curriculumId, table.slug)],
)

export const vocabLessons = pgTable(
  "vocab_lessons",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => vocabTopics.id, { onDelete: "cascade" }),
    curriculumId: text("curriculum_id")
      .notNull()
      .references(() => vocabCurricula.id, { onDelete: "cascade" }),
    languageCode: text("language_code")
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    storyId: text("story_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    wordCount: integer("word_count").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
    nextStoryId: text("next_story_id"),
    nextStoryTitle: text("next_story_title"),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [uniqueIndex("vocab_lessons_topic_slug_idx").on(table.topicId, table.slug)],
)

export const vocabWords = pgTable(
  "vocab_words",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => vocabLessons.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    term: text("term").notNull(),
    ipa: text("ipa"),
    partOfSpeech: text("part_of_speech").notNull(),
    meaningVi: text("meaning_vi").notNull(),
    definition: text("definition").notNull(),
    example: text("example").notNull(),
    exampleVi: text("example_vi").notNull(),
    collocations: jsonb("collocations").$type<string[]>().notNull().default([]),
    distractors: jsonb("distractors").$type<string[]>().notNull().default([]),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [uniqueIndex("vocab_words_lesson_slug_idx").on(table.lessonId, table.slug)],
)

export const userVocabLessonProgress = pgTable(
  "user_vocab_lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => vocabLessons.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("not_started"),
    currentStep: text("current_step").notNull().default("overview"),
    masteredCount: integer("mastered_count").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
)

export const userVocabWeakItems = pgTable(
  "user_vocab_weak_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    vocabularyWordId: text("vocabulary_word_id")
      .notNull()
      .references(() => vocabWords.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => vocabLessons.id, { onDelete: "cascade" }),
    targetLessonId: text("target_lesson_id").references(() => vocabLessons.id, {
      onDelete: "set null",
    }),
    weakSource: text("weak_source").notNull(),
    reviewFlashcardRequired: boolean("review_flashcard_required").notNull().default(true),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at").notNull(),
    clearedAt: text("cleared_at"),
  },
)

export type VocabLessonRow = typeof vocabLessons.$inferSelect
export type VocabWordRow = typeof vocabWords.$inferSelect
