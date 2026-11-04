import { pgTable, smallint, text, uniqueIndex, uuid } from "drizzle-orm/pg-core"

import { languages } from "./languages"

export const proficiencyLevels = pgTable(
  "proficiency_levels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    languageCode: text("language_code")
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    code: text("code").notNull(),
    framework: text("framework").notNull(),
    sortOrder: smallint("sort_order").notNull().default(0),
  },
  (table) => [uniqueIndex("proficiency_levels_language_code_idx").on(table.languageCode, table.code)],
)

export type ProficiencyLevelRow = typeof proficiencyLevels.$inferSelect
