import { getPublicApiBaseUrl } from "@/lib/api/env"

export type ServerFetchOptions = {
  /** Public CDN-style cache for anonymous prerender / static paths. */
  revalidateSeconds?: number
}

/**
 * Server Component fetch to Hono API — cached by default so Cache Components can prerender.
 * Logged-in resume/progress is loaded on the client (see vocab/writing progress hooks).
 */
export async function serverFetchJson<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  const revalidateSeconds = options.revalidateSeconds ?? 60
  try {
    const res = await fetch(`${getPublicApiBaseUrl()}${path}`, {
      next: { revalidate: revalidateSeconds },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}
