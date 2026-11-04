import { createReadStream } from "node:fs"
import { access, constants as fsConstants, stat } from "node:fs/promises"
import path from "node:path"

import { AppError } from "../shared/errors"
import { getObjectStream, isStorageConfigured, statMediaObject } from "./objects"

const DEFAULT_MEDIA_ROOT = path.join(process.cwd(), "data/listening-media")

/** Dev-only escape hatch; production uses MinIO/R2 only. */
function allowLocalListeningFallback(): boolean {
  return process.env.ALLOW_LISTENING_LOCAL_MEDIA === "true"
}

export function listeningMediaRoot(): string {
  return process.env.LISTENING_MEDIA_DIR?.trim() || DEFAULT_MEDIA_ROOT
}

/** Object keys: `listening/{lang}/lessons/{lessonId}/audio.mp3` */
export function assertSafeListeningObjectKey(key: string): string {
  const normalized = key.replace(/\\/g, "/").replace(/^\/+/, "")
  if (!normalized.startsWith("listening/")) {
    throw new AppError("INVALID_MEDIA_KEY", "Invalid listening audio key.", 400)
  }
  if (normalized.includes("..") || normalized.includes("\0")) {
    throw new AppError("INVALID_MEDIA_KEY", "Invalid listening audio key.", 400)
  }
  return normalized
}

function localAbsolutePath(storageKey: string): string {
  const root = path.resolve(listeningMediaRoot())
  const absolute = path.resolve(root, storageKey)
  if (!absolute.startsWith(root + path.sep) && absolute !== root) {
    throw new AppError("INVALID_MEDIA_KEY", "Invalid listening audio key.", 400)
  }
  return absolute
}

async function localListeningAudioExists(storageKey: string): Promise<boolean> {
  try {
    await access(localAbsolutePath(storageKey), fsConstants.R_OK)
    return true
  } catch {
    return false
  }
}

export type ListeningAudioSource =
  | { kind: "file"; path: string; size: number }
  | { kind: "object"; key: string; size: number; contentType: string }

export async function resolveListeningAudioSource(storageKey: string): Promise<ListeningAudioSource> {
  const key = assertSafeListeningObjectKey(storageKey)

  if (isStorageConfigured()) {
    try {
      const { size, contentType } = await statMediaObject(key)
      return { kind: "object", key, size, contentType }
    } catch (err) {
      if (!allowLocalListeningFallback()) {
        throw new AppError("AUDIO_NOT_FOUND", "Listening audio object not found in storage.", 404)
      }
    }
  }

  if (allowLocalListeningFallback() && (await localListeningAudioExists(key))) {
    const fileStat = await stat(localAbsolutePath(key))
    return { kind: "file", path: localAbsolutePath(key), size: fileStat.size }
  }

  throw new AppError(
    "STORAGE_UNAVAILABLE",
    "Object storage is required. Start MinIO (docker compose) and set STORAGE_* env.",
    503,
  )
}

export async function openListeningAudioStream(
  source: ListeningAudioSource,
  byteRange?: { start: number; end: number },
): Promise<NodeJS.ReadableStream> {
  if (source.kind === "file") {
    return createReadStream(
      source.path,
      byteRange ? { start: byteRange.start, end: byteRange.end } : undefined,
    )
  }

  const offset = byteRange?.start ?? 0
  const length = byteRange ? byteRange.end - byteRange.start + 1 : source.size - offset
  const { stream } = await getObjectStream(source.key, { offset, length })
  return stream
}

export function parseByteRangeHeader(
  rangeHeader: string | undefined,
  fileSize: number,
): { start: number; end: number } | null {
  if (!rangeHeader?.startsWith("bytes=")) return null
  const [startStr, endStr] = rangeHeader.slice(6).split("-", 2)
  if (startStr == null || startStr === "") return null
  const start = Number.parseInt(startStr, 10)
  if (!Number.isFinite(start) || start < 0 || start >= fileSize) return null
  const end =
    endStr != null && endStr !== ""
      ? Math.min(fileSize - 1, Number.parseInt(endStr, 10))
      : fileSize - 1
  if (!Number.isFinite(end) || end < start) return null
  return { start, end }
}

export function listeningAudioContentType(source: ListeningAudioSource): string {
  if (source.kind === "object") return source.contentType
  return "audio/mpeg"
}

export function buildListeningAudioUrl(
  apiBaseUrl: string,
  languageCode: string,
  storageKey: string,
): string {
  const key = assertSafeListeningObjectKey(storageKey)
  const base = apiBaseUrl.replace(/\/+$/, "")
  const segments = key.split("/").map(encodeURIComponent).join("/")
  return `${base}/v1/languages/${encodeURIComponent(languageCode)}/listening/audio/${segments}`
}
