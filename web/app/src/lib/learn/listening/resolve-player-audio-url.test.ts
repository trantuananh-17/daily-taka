import { describe, expect, it } from "vitest"

import { resolvePlayerAudioUrl } from "./resolve-player-audio-url"

describe("resolvePlayerAudioUrl", () => {
  it("keeps absolute API URL (no Next rewrite)", () => {
    const url =
      "http://localhost:8080/v1/languages/en/listening/audio/listening/en/lessons/x/audio.mp3"
    expect(resolvePlayerAudioUrl(url)).toBe(url)
  })

  it("passes through relative URLs", () => {
    expect(resolvePlayerAudioUrl("/foo.mp3")).toBe("/foo.mp3")
  })
})
