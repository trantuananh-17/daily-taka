import { describe, expect, it } from "vitest"

import { buildMockDashboardAnalytics, buildMockDashboardInsights } from "./admin-dashboard.insights.mock"
import { buildDashboardKpis } from "./admin-dashboard.kpis"
import { adminDashboardSummarySchema } from "./admin-dashboard.summary.schema"

/** Minimal fixture — same fields as FE mock; keeps contract stable. */
const fixture = {
  generatedAt: "2026-11-05T08:00:00.000Z",
  global: {
    usersTotal: 1,
    usersActive7d: 1,
    progressEventsToday: 0,
    ticketsOpen: 0,
    ticketsInProgress: 0,
    apiErrors24h: 0,
    storageOk: true,
  },
  capabilities: { listen: ["en"], vocabDb: ["en"], writingDb: [] as const },
  byLanguage: [
    {
      language: "en" as const,
      label: "English",
      listen: {
        categories: 1,
        sections: 1,
        lessonsPublished: 1,
        lessonsDraft: 0,
        lessonsMissingAudio: 0,
      },
      vocab: null,
      writing: null,
    },
  ],
  activity30d: [{ date: "2026-11-01", listen: 1, vocab: 0, writing: 0 }],
  languageModuleActivity30d: [
    {
      date: "2026-11-01",
      en: { listen: 1, vocab: 0, writing: 0 },
      zh: { listen: 0, vocab: 0, writing: 0 },
      jp: { listen: 0, vocab: 0, writing: 0 },
    },
  ],
  attention: [],
}

const fixtureWithKpis = {
  ...fixture,
  kpis: buildDashboardKpis({
    global: fixture.global,
    activity30d: fixture.activity30d,
    byLanguage: fixture.byLanguage,
  }),
  insights: buildMockDashboardInsights(),
  analytics: buildMockDashboardAnalytics(),
}

describe("adminDashboardSummarySchema", () => {
  it("parses a valid summary body", () => {
    expect(() => adminDashboardSummarySchema.parse(fixtureWithKpis)).not.toThrow()
  })
})
