import { hc } from "hono/client"

import type { AppType } from "./app-type"

export function createApiClient(baseUrl: string) {
  return hc<AppType>(baseUrl)
}

export type ApiClient = ReturnType<typeof createApiClient>
