import { describe, expect, it, vi } from "vitest"
import { Hono } from "hono"

import { errorHandler } from "../api/middleware/error-handler"

vi.mock("../config/env", () => ({
  env: { adminApiKey: "test-admin-key-min-16-chars" },
}))

import { requireAdminAuth } from "./require-admin-auth"

function adminApp() {
  const app = new Hono()
  app.onError(errorHandler)
  app.use("*", requireAdminAuth())
  app.get("/v1/admin/ping", (c) => c.json({ ok: true }))
  return app
}

describe("requireAdminAuth", () => {
  it("returns 401 without credentials", async () => {
    const res = await adminApp().request("/v1/admin/ping")
    expect(res.status).toBe(401)
  })

  it("returns 200 with bearer key", async () => {
    const res = await adminApp().request("/v1/admin/ping", {
      headers: { Authorization: "Bearer test-admin-key-min-16-chars" },
    })
    expect(res.status).toBe(200)
  })
})
