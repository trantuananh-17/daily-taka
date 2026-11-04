import { access, constants as fsConstants } from "node:fs/promises"

const DEFAULT_DOWNLOAD = "D:\\Home\\Downloads\\first-snow-fall.mp3"

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.R_OK)
    return true
  } catch {
    return false
  }
}

/** Resolve source MP3 on disk for one-time upload to MinIO (not copied into repo). */
export async function resolveFirstSnowAudioSourcePath(): Promise<string> {
  const candidates = [
    process.env.FIRST_SNOW_AUDIO_SOURCE?.trim(),
    DEFAULT_DOWNLOAD,
  ].filter((value): value is string => Boolean(value))

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate
  }

  throw new Error(
    "First Snow MP3 not found. Set FIRST_SNOW_AUDIO_SOURCE to your file path (e.g. D:\\Home\\Downloads\\first-snow-fall.mp3).",
  )
}
