import {
  buildMockDashboardAnalytics,
  buildMockDashboardInsights,
} from "@dailytaka/admin-dashboard-insights-mock"
import { buildDashboardKpis } from "@dailytaka/admin-dashboard-kpis"

import type { AdminDashboardSummary } from "@/lib/admin-dashboard/types"

const MOCK_ACTIVITY_START = new Date("2026-10-08T12:00:00Z")
const MOCK_ACTIVITY_DAYS = 30

function mockActivityDates(): string[] {
  const dates: string[] = []
  for (let i = 0; i < MOCK_ACTIVITY_DAYS; i++) {
    const d = new Date(MOCK_ACTIVITY_START)
    d.setUTCDate(d.getUTCDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

function buildMockActivity30d(): AdminDashboardSummary["activity30d"] {
  return mockActivityDates().map((date, i) => {
    const t = i / (MOCK_ACTIVITY_DAYS - 1)
    return {
      date,
      listen: Math.round(38 + t * 23 + (i % 5)),
      vocab: Math.round(72 + t * 46 + (i % 7)),
      writing: Math.round(10 + t * 9 + (i % 3)),
    }
  })
}

function splitModuleTotal(
  total: number,
  ratios: { listen: number; vocab: number; writing: number },
): AdminDashboardSummary["languageModuleActivity30d"][number]["en"] {
  const listen = Math.round(total * ratios.listen)
  const vocab = Math.round(total * ratios.vocab)
  const writing = Math.max(0, total - listen - vocab)
  return { listen, vocab, writing }
}

function buildMockLanguageModuleActivity30d(): AdminDashboardSummary["languageModuleActivity30d"] {
  return mockActivityDates().map((date, i) => {
    const t = i / (MOCK_ACTIVITY_DAYS - 1)
    const base = 55 + t * 35
    const enTotal = Math.round(base * 0.52 + (i % 4))
    const zhTotal = Math.round(base * 0.28 + (i % 3))
    const jpTotal = Math.round(base * 0.2 + (i % 2))
    return {
      date,
      en: splitModuleTotal(enTotal, { listen: 0.34, vocab: 0.48, writing: 0.18 }),
      zh: splitModuleTotal(zhTotal, { listen: 0.68, vocab: 0.26, writing: 0.06 }),
      jp: splitModuleTotal(jpTotal, { listen: 0.62, vocab: 0.3, writing: 0.08 }),
    }
  })
}

const mockGlobal = {
  usersTotal: 1284,
  usersActive7d: 312,
  progressEventsToday: 847,
  ticketsOpen: 3,
  ticketsInProgress: 2,
  apiErrors24h: 1,
  storageOk: true,
}

const mockByLanguage = [
  {
    language: "en",
      label: "English",
      listen: {
        categories: 4,
        sections: 14,
        lessonsPublished: 28,
        lessonsDraft: 2,
        lessonsMissingAudio: 1,
      },
      vocab: { levels: 4, lessons: 48, words: 620 },
      writing: { lessons: 6, sentences: 72 },
    },
    {
      language: "zh",
      label: "中文",
      listen: {
        categories: 3,
        sections: 9,
        lessonsPublished: 15,
        lessonsDraft: 1,
        lessonsMissingAudio: 0,
      },
      vocab: null,
      writing: null,
    },
    {
      language: "jp",
      label: "日本語",
      listen: {
        categories: 3,
        sections: 8,
        lessonsPublished: 12,
        lessonsDraft: 0,
        lessonsMissingAudio: 2,
      },
      vocab: null,
      writing: null,
    },
] as const satisfies AdminDashboardSummary["byLanguage"]

const mockActivity30d = buildMockActivity30d()

/** Mock payload — same shape as `GET /v1/admin/dashboard/summary`. Do not fetch API until user requests. */
export const MOCK_ADMIN_DASHBOARD_SUMMARY = {
  generatedAt: new Date().toISOString(),
  global: mockGlobal,
  kpis: buildDashboardKpis({
    global: mockGlobal,
    activity30d: mockActivity30d,
    byLanguage: [...mockByLanguage],
  }),
  insights: buildMockDashboardInsights(),
  analytics: buildMockDashboardAnalytics(),
  capabilities: {
    listen: ["en", "zh", "jp"],
    vocabDb: ["en"],
    writingDb: ["en"],
  },
  byLanguage: [...mockByLanguage],
  activity30d: mockActivity30d,
  languageModuleActivity30d: buildMockLanguageModuleActivity30d(),
  attention: [
    {
      id: "att-1",
      kind: "missing_audio",
      language: "en",
      title: "Listen: 1 lesson thiếu file audio trên MinIO",
      href: "/listen",
    },
    {
      id: "att-2",
      kind: "draft",
      language: "en",
      title: "Listen: 2 bài draft chưa publish",
      href: "/listen",
    },
    {
      id: "att-3",
      kind: "missing_audio",
      language: "jp",
      title: "Listen: 2 bài thiếu audio",
      href: "/listen",
    },
    {
      id: "att-4",
      kind: "ticket",
      language: null,
      title: "Ticket TK-1042 — audio không phát (First Snow)",
      href: "/reports",
    },
    {
      id: "att-5",
      kind: "api_error",
      language: null,
      title: "API: 1 lỗi 503 admin auth (24h)",
      href: "/logs",
    },
  ],
} satisfies AdminDashboardSummary
