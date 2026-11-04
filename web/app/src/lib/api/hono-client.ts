import { createApiClient, type ApiClient } from "@dailytaka/backend/api-client"

import { getPublicApiBaseUrl } from "@/lib/api/env"

let client: ApiClient | undefined

export function getHonoClient(): ApiClient {
  if (!client) {
    client = createApiClient(getPublicApiBaseUrl())
  }
  return client
}
