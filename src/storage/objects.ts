import { Client } from "minio"

import { env } from "../config/env"
import { AppError } from "../shared/errors"

/**
 * Audio clips, vocabulary pronunciation, lesson illustrations — bytes live here,
 * not in Postgres. DB stores object_key + public/CDN URL only.
 */
export class StorageUnavailableError extends AppError {
  constructor() {
    super(
      "STORAGE_UNAVAILABLE",
      "Object storage is not configured.",
      503,
    )
  }
}

let client: Client | undefined

function getClient(): Client {
  if (!env.storage) throw new StorageUnavailableError()
  client ??= new Client({
    endPoint: env.storage.endPoint,
    port: env.storage.port,
    useSSL: env.storage.useSSL,
    accessKey: env.storage.accessKey,
    secretKey: env.storage.secretKey,
    region: env.storage.region,
  })
  return client
}

export function isStorageConfigured(): boolean {
  return env.storage !== undefined
}

export function mediaBucket(): string {
  if (!env.storage) throw new StorageUnavailableError()
  return env.storage.bucket
}

/** Keys: `audio/{lessonId}/{sentenceId}.mp3`, `images/{assetId}.webp` */
export function buildMediaObjectKey(parts: string[]): string {
  return parts.filter(Boolean).join("/")
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  const c = getClient()
  await c.putObject(mediaBucket(), key, body, body.length, { "Content-Type": contentType })
}
