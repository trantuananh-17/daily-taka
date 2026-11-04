import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  API_BASE_URL: z.url(),
  APP_BASE_URL: z.url(),
  TRUSTED_ORIGINS: z.string().default(""),
  BETTER_AUTH_SECRET: z.string().min(32),
  DATABASE_URL: z.string().min(1),
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_PORT: z.coerce.number().int().positive().default(9000),
  STORAGE_USE_SSL: z.enum(["true", "false"]).default("false"),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  STORAGE_BUCKET: z.string().default("dailytaka-media"),
  STORAGE_REGION: z.string().default("us-east-1"),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors)
  throw new Error("Invalid environment configuration")
}

const raw = parsed.data

export const env = {
  nodeEnv: raw.NODE_ENV,
  port: raw.PORT,
  apiBaseUrl: raw.API_BASE_URL,
  appBaseUrl: raw.APP_BASE_URL,
  trustedOrigins: raw.TRUSTED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean),
  betterAuthSecret: raw.BETTER_AUTH_SECRET,
  databaseUrl: raw.DATABASE_URL,
  storage:
    raw.STORAGE_ENDPOINT && raw.STORAGE_ACCESS_KEY && raw.STORAGE_SECRET_KEY
      ? {
          endPoint: raw.STORAGE_ENDPOINT,
          port: raw.STORAGE_PORT,
          useSSL: raw.STORAGE_USE_SSL === "true",
          accessKey: raw.STORAGE_ACCESS_KEY,
          secretKey: raw.STORAGE_SECRET_KEY,
          bucket: raw.STORAGE_BUCKET,
          region: raw.STORAGE_REGION,
        }
      : undefined,
} as const
