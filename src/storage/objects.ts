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

/** Keys: `listening/en/lessons/{id}/audio.mp3`, `images/{assetId}.webp` */
export function buildMediaObjectKey(parts: string[]): string {
  return parts.filter(Boolean).join("/")
}

export async function ensureMediaBucket(): Promise<void> {
  const c = getClient()
  const bucket = mediaBucket()
  const exists = await c.bucketExists(bucket)
  if (!exists) {
    await c.makeBucket(bucket, env.storage!.region)
  }
}

export async function statMediaObject(key: string): Promise<{
  size: number
  contentType: string
}> {
  const c = getClient()
  const stat = await c.statObject(mediaBucket(), key)
  const contentType =
    stat.metaData?.["content-type"] ??
    stat.metaData?.["Content-Type"] ??
    "application/octet-stream"
  return { size: stat.size, contentType }
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await statMediaObject(key)
    return true
  } catch {
    return false
  }
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  const c = getClient()
  await c.putObject(mediaBucket(), key, body, body.length, { "Content-Type": contentType })
}

export async function getObjectStream(
  key: string,
  range?: { offset: number; length: number },
): Promise<{
  stream: NodeJS.ReadableStream
  contentType: string
  size: number
}> {
  const meta = await statMediaObject(key)
  const c = getClient()
  const bucket = mediaBucket()
  const stream =
    range != null
      ? await (c.getPartialObject(
          bucket,
          key,
          range.offset,
          range.length,
        ) as Promise<NodeJS.ReadableStream>)
      : await (c.getObject(bucket, key) as Promise<NodeJS.ReadableStream>)
  return { stream, contentType: meta.contentType, size: meta.size }
}
