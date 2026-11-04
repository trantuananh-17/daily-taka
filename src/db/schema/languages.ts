import { boolean, pgTable, smallint, text } from "drizzle-orm/pg-core"

export const languages = pgTable("languages", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: smallint("sort_order").notNull().default(0),
})

export type LanguageRow = typeof languages.$inferSelect
