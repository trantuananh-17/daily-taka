import { isStorageConfigured } from "../../storage/objects"
import {
  ACTIVITY_LOOKBACK_DAYS,
  ADMIN_DASHBOARD_LANGUAGE_CODES,
  ADMIN_DASHBOARD_LANGUAGE_LABELS,
  type AdminDashboardLanguageCode,
} from "./admin-dashboard.constants"
import { buildMockDashboardAnalytics, buildMockDashboardInsights } from "./admin-dashboard.insights.mock"
import { buildDashboardKpis } from "./admin-dashboard.kpis"
import { AdminDashboardRepository } from "./admin-dashboard.repository"

function utcDateKeys(lastNDays: number): string[] {
  const keys: string[] = []
  const cursor = new Date()
  cursor.setUTCHours(0, 0, 0, 0)
  cursor.setUTCDate(cursor.getUTCDate() - (lastNDays - 1))
  for (let i = 0; i < lastNDays; i++) {
    keys.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return keys
}

function startOfUtcDay(d = new Date()): Date {
  const x = new Date(d)
  x.setUTCHours(0, 0, 0, 0)
  return x
}

export class AdminDashboardService {
  constructor(private readonly repo: AdminDashboardRepository) {}

  async getSummary() {
    const since = AdminDashboardRepository.activitySinceDate()
    const todayStart = startOfUtcDay()

    const [
      usersTotal,
      usersActive7d,
      progressEventsToday,
      moduleByDay,
      languageModuleByDay,
      listenLangs,
      vocabLangs,
      writingLangs,
    ] = await Promise.all([
      this.repo.countUsers(),
      this.repo.countUsersActive7d(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      this.repo.countProgressEventsSince(todayStart),
      this.repo.dailyModuleActivitySince(since),
      this.repo.dailyLanguageModuleActivitySince(since),
      this.repo.listLanguagesWithListen(),
      this.repo.listLanguagesWithVocabDb(),
      this.repo.listLanguagesWithWritingDb(),
    ])

    const byLanguage = await Promise.all(
      ADMIN_DASHBOARD_LANGUAGE_CODES.map(async (language) => ({
        language,
        label: ADMIN_DASHBOARD_LANGUAGE_LABELS[language],
        listen: await this.repo.listenContentStats(language),
        vocab: await this.repo.vocabContentStats(language),
        writing: await this.repo.writingContentStats(language),
      })),
    )

    const dateKeys = utcDateKeys(ACTIVITY_LOOKBACK_DAYS)
    const activity30d = dateKeys.map((date) => {
      const row = moduleByDay.get(date) ?? { listen: 0, vocab: 0, writing: 0 }
      return { date, ...row }
    })
    const languageModuleActivity30d = dateKeys.map((date) => {
      const row = languageModuleByDay.get(date)
      const empty = { listen: 0, vocab: 0, writing: 0 }
      return {
        date,
        en: row?.en ?? empty,
        zh: row?.zh ?? empty,
        jp: row?.jp ?? empty,
      }
    })

    const attention = buildAttentionItems(byLanguage)
    const global = {
      usersTotal,
      usersActive7d,
      progressEventsToday,
      ticketsOpen: 0,
      ticketsInProgress: 0,
      apiErrors24h: 0,
      storageOk: isStorageConfigured(),
    }

    return {
      generatedAt: new Date().toISOString(),
      global,
      kpis: buildDashboardKpis({ global, activity30d, byLanguage }),
      insights: buildMockDashboardInsights(),
      analytics: buildMockDashboardAnalytics(),
      byLanguage,
      capabilities: {
        listen: listenLangs,
        vocabDb: vocabLangs,
        writingDb: writingLangs,
      },
      activity30d,
      languageModuleActivity30d,
      attention,
    }
  }
}

function buildAttentionItems(
  byLanguage: Awaited<ReturnType<AdminDashboardService["getSummary"]>>["byLanguage"],
) {
  const items: {
    id: string
    kind: "draft" | "missing_audio"
    language: AdminDashboardLanguageCode
    title: string
    href: string
  }[] = []

  for (const row of byLanguage) {
    const { listen } = row
    if (listen.lessonsMissingAudio > 0) {
      items.push({
        id: `missing-audio-${row.language}`,
        kind: "missing_audio",
        language: row.language,
        title: `Listen: ${listen.lessonsMissingAudio} bài thiếu audio`,
        href: "/listen",
      })
    }
    if (listen.lessonsDraft > 0) {
      items.push({
        id: `draft-${row.language}`,
        kind: "draft",
        language: row.language,
        title: `Listen: ${listen.lessonsDraft} bài draft`,
        href: "/listen",
      })
    }
  }

  return items
}
