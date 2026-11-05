import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { env } from "../config/env"
import { db } from "../db/client"
import * as schema from "../db/schema/auth"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: env.betterAuthSecret,
  baseURL: env.apiBaseUrl,
  trustedOrigins: [env.appBaseUrl, env.apiBaseUrl, ...env.trustedOrigins],
  emailAndPassword: {
    enabled: true,
  },
})
