import { describe, expect, it } from "vitest"

import { formatSegmentDuration, mapSentenceRow, resolveLessonAudioUrl } from "./listening.mapper"

describe("formatSegmentDuration", () => {
  it("formats mm:ss", () => {
    expect(formatSegmentDuration(125_000)).toBe("2:05")
    expect(formatSegmentDuration(2000)).toBe("0:02")
  })
})

describe("resolveLessonAudioUrl", () => {
  it("builds API audio URL from storage key", () => {
    const url = resolveLessonAudioUrl({
      apiBaseUrl: "http://localhost:8080",
      lesson: {
        id: "lesson-en-short-stories-1-1",
        sectionId: "section-en-short-stories-1",
        categoryId: "category-en-short-stories",
        languageCode: "en",
        slug: "first-snow-fall",
        title: "First Snow Fall",
        levelCode: "A1",
        displayOrder: 1,
        sentenceCount: 21,
        durationMs: 67082,
        stars: 4,
        templateType: "audio",
        audioStorageKey: "listening/en/lessons/lesson-en-short-stories-1-1/audio.mp3",
        audioPublicPath: null,
        metadata: null,
        path: null,
        dictationGradingDefaults: null,
        isPublished: true,
      },
    })
    expect(url).toBe(
      "http://localhost:8080/v1/languages/en/listening/audio/listening/en/lessons/lesson-en-short-stories-1-1/audio.mp3",
    )
  })
})

describe("mapSentenceRow", () => {
  it("maps proper nouns from metadata", () => {
    const dto = mapSentenceRow({
      id: "00000000-0000-4000-8000-000000000001",
      lessonId: "lesson-en-short-stories-1-1",
      position: 1,
      startMs: 0,
      endMs: 3000,
      transcript: "Hello Jessica.",
      metadata: { properNames: ["Jessica"], ipa: "/həˈloʊ/" },
    })
    expect(dto.properNouns).toEqual(["Jessica"])
    expect(dto.durationLabel).toBe("0:03")
  })
})
