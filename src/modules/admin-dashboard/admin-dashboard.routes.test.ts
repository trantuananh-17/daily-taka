import { describe, expect, it } from "vitest"

import { createApp } from "../../api/app"

describe("GET /v1/admin/dashboard/summary", () => {
  it("returns 401 without admin key", async () => {
    const app = createApp()
    const res = await app.request("/v1/admin/dashboard/summary")
    expect(res.status).toBe(401)
  })
})
