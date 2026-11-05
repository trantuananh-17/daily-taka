import { boolean, integer, jsonb, pgTable, primaryKey, smallint, text, timestamp } from "drizzle-orm/pg-core"

import { user } from "./auth"
import { listeningLessons } from "./listening"

export const userListenLessonProgress = pgTable(
  "user_listen_lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => listeningLessons.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("not_started"),
    completedSentenceCount: integer("completed_sentence_count").notNull().default(0),
    lastSentencePosition: integer("last_sentence_position").notNull().default(1),
    lastPositionMs: integer("last_position_ms"),
    completionCount: integer("completion_count").notNull().default(0),
    completionCycleActive: boolean("completion_cycle_active").notNull().default(true),
    isStarred: boolean("is_starred").notNull().default(false),
    starCount: smallint("star_count").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
)

export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  preferences: jsonb("preferences").notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type UserListenLessonProgressRow = typeof userListenLessonProgress.$inferSelect
export type UserSettingsRow = typeof userSettings.$inferSelect
