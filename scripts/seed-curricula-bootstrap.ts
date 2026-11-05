/**
 * Ensure vocab_curricula + writing_curricula rows for all learner app levels (en/zh/jp).
 * Run: pnpm db:bootstrap-curricula
 */
import "dotenv/config"

import { closeDatabase, db } from "../src/db/client"
import { vocabCurricula } from "../src/db/schema/vocab"
import { writingCurricula } from "../src/db/schema/writing"

const LEVELS: Record<string, string[]> = {
  en: ["A1", "A2", "B1", "B2", "C1", "C2"],
  zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
  jp: ["N5", "N4", "N3", "N2", "N1"],
}

function curriculumId(skill: "vocab" | "writing", languageCode: string, levelCode: string) {
  return `curriculum-${languageCode}-${skill}-${levelCode.toLowerCase()}`
}

async function main() {
  let count = 0
  for (const [languageCode, levels] of Object.entries(LEVELS)) {
    for (const levelCode of levels) {
      for (const skill of ["vocab", "writing"] as const) {
        const id = curriculumId(skill, languageCode, levelCode)
        const title =
          skill === "vocab"
            ? `${languageCode.toUpperCase()} ${levelCode} Vocabulary`
            : `${languageCode.toUpperCase()} ${levelCode} Writing`
        const table = skill === "vocab" ? vocabCurricula : writingCurricula
        await db
          .insert(table)
          .values({
            id,
            languageCode,
            levelCode,
            title,
            sortOrder: levels.indexOf(levelCode) + 1,
            isPublished: true,
          })
          .onConflictDoNothing()
        count += 1
      }
    }
  }
  console.info(`seed-curricula-bootstrap: ensured ${count} curriculum slots (idempotent)`)
  await closeDatabase()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
