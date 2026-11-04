import { describe, expect, it } from "vitest"

import { createApp } from "./app"

describe("createApp", () => {
  it("returns root payload", async () => {
    const res = await createApp().request("/")
    expect(res.status).toBe(200)
    const body = (await res.json()) as { name: string }
    expect(body.name).toBe("dailytaka-api")
  })
})
