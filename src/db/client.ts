import { drizzle } from "drizzle-orm/node-postgres"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { sql } from "drizzle-orm"
import { Pool } from "pg"

import { env } from "../config/env"
import * as schema from "./schema"

export type Database = NodePgDatabase<typeof schema>
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0]
export type DbExecutor = Database | Transaction

let pool: Pool | undefined
let database: Database | undefined

function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: env.databaseUrl })
  return pool
}

function getDatabase(): Database {
  if (!database) database = drizzle(getPool(), { schema })
  return database
}

export const db = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getDatabase() as object, prop, receiver)
  },
})

export async function checkDatabaseConnection() {
  try {
    await db.execute(sql`select 1`)
    return { ok: true as const }
  } catch (error) {
    return { ok: false as const, error: String(error) }
  }
}

export async function closeDatabase() {
  await pool?.end()
  pool = undefined
  database = undefined
}
