import { migrate } from "drizzle-orm/node-postgres/migrator"

import { closeDatabase, db } from "./client"

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" })
  await closeDatabase()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
