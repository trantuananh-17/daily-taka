import {
  boolean,
  customType,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

const tsvector = customType<{ data: string | null }>({
  dataType() {
    return "tsvector"
  },
})

import { languages } from "./languages"

export const listeningCategories = pgTable(
  "listening_categories",
  {
    id: text("id").primaryKey(),
    languageCode: text("language_code")
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    descriptionVi: text("description_vi"),
    sortOrder: integer("sort_order").notNull().default(0),
    lessonCount: integer("lesson_count").notNull().default(0),
    levels: text("levels").array().notNull().default([]),
    cover: jsonb("cover"),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [uniqueIndex("listening_categories_language_slug_idx").on(table.languageCode, table.slug)],
)

export const listeningSections = pgTable(
  "listening_sections",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => listeningCategories.id, { onDelete: "cascade" }),
    sectionNumber: integer("section_number").notNull(),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    access: text("access").notNull().default("full"),
  },
  (table) => [
    uniqueIndex("listening_sections_category_number_idx").on(table.categoryId, table.sectionNumber),
  ],
)

export const listeningLessons = pgTable(
  "listening_lessons",
  {
    id: text("id").primaryKey(),
    sectionId: text("section_id")
      .notNull()
      .references(() => listeningSections.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => listeningCategories.id, { onDelete: "cascade" }),
    languageCode: text("language_code")
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    levelCode: text("level_code").notNull(),
    displayOrder: integer("display_order").notNull(),
    sentenceCount: integer("sentence_count").notNull().default(0),
    durationMs: integer("duration_ms"),
    stars: smallint("stars").notNull().default(0),
    templateType: text("template_type").notNull().default("audio"),
    audioStorageKey: text("audio_storage_key"),
    audioPublicPath: text("audio_public_path"),
    metadata: jsonb("metadata"),
    path: text("path"),
    dictationGradingDefaults: jsonb("dictation_grading_defaults"),
    searchVector: tsvector("search_vector"),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [uniqueIndex("listening_lessons_section_slug_idx").on(table.sectionId, table.slug)],
)

export const listeningSentences = pgTable(
  "listening_sentences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => listeningLessons.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    startMs: integer("start_ms").notNull(),
    endMs: integer("end_ms").notNull(),
    transcript: text("transcript").notNull(),
    metadata: jsonb("metadata"),
  },
  (table) => [uniqueIndex("listening_sentences_lesson_position_idx").on(table.lessonId, table.position)],
)

export type ListeningCategoryRow = typeof listeningCategories.$inferSelect
export type ListeningSectionRow = typeof listeningSections.$inferSelect
export type ListeningLessonRow = typeof listeningLessons.$inferSelect
export type ListeningSentenceRow = typeof listeningSentences.$inferSelect
