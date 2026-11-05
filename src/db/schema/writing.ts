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

export type WritingScriptModeJson = {
  id: string
  label: string
  inputKind: "latin" | "cjk"
}

export type WritingPronunciationJson = {
  word: string
  ipa?: string
  pinyin?: string
  romaji?: string
}

export const writingCurricula = pgTable(
  "writing_curricula",
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
    uniqueIndex("writing_curricula_language_level_idx").on(table.languageCode, table.levelCode),
  ],
)

export const writingTopics = pgTable(
  "writing_topics",
  {
    id: text("id").primaryKey(),
    curriculumId: text("curriculum_id")
      .notNull()
      .references(() => writingCurricula.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [uniqueIndex("writing_topics_curriculum_slug_idx").on(table.curriculumId, table.slug)],
)

export const writingLessons = pgTable(
  "writing_lessons",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => writingTopics.id, { onDelete: "cascade" }),
    curriculumId: text("curriculum_id")
      .notNull()
      .references(() => writingCurricula.id, { onDelete: "cascade" }),
    languageCode: text("language_code")
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    contentId: text("content_id").notNull(),
    title: text("title").notNull(),
    levelCode: text("level_code").notNull(),
    sentenceCount: integer("sentence_count").notNull().default(0),
    scriptModes: jsonb("script_modes").$type<WritingScriptModeJson[] | null>(),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [uniqueIndex("writing_lessons_topic_slug_idx").on(table.topicId, table.slug)],
)

export const writingSentences = pgTable(
  "writing_sentences",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => writingLessons.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    promptVi: text("prompt_vi").notNull(),
    targetDefault: text("target_default").notNull(),
    targetsByMode: jsonb("targets_by_mode").$type<Record<string, string>>().notNull().default({}),
    pronunciationKind: text("pronunciation_kind"),
    pronunciation: jsonb("pronunciation").$type<WritingPronunciationJson[]>().notNull().default([]),
  },
  (table) => [uniqueIndex("writing_sentences_lesson_sort_idx").on(table.lessonId, table.sortOrder)],
)

export const userWritingLessonProgress = pgTable(
  "user_writing_lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => writingLessons.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("in_progress"),
    currentSentenceIndex: integer("current_sentence_index").notNull().default(0),
    doneSentenceIndexes: jsonb("done_sentence_indexes").$type<number[]>().notNull().default([]),
    drafts: jsonb("drafts").$type<Record<string, string>>().notNull().default({}),
    scriptModeId: text("script_mode_id"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
)

export type WritingLessonRow = typeof writingLessons.$inferSelect
export type WritingSentenceRow = typeof writingSentences.$inferSelect
