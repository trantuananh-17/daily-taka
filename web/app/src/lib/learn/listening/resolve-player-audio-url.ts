/**
 * Use API absolute URL for `<audio>` — Next.js `/v1` rewrites often break streaming (ERR_EMPTY_RESPONSE).
 * Backend sends Range + CORS expose headers for cross-origin seek from localhost:3000 → :8080.
 */
export function resolvePlayerAudioUrl(audioUrl: string | undefined): string | undefined {
  if (!audioUrl) return undefined
  return audioUrl
}
