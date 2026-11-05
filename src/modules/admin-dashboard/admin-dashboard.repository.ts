import { and, count, eq, gte, isNull, or, sql } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import { user } from "../../db/schema/auth"
import { listeningCategories, listeningLessons, listeningSections } from "../../db/schema/listening"
import { userListenLessonProgress } from "../../db/schema/user-learning"
import { userVocabLessonProgress, vocabCurricula, vocabLessons, vocabWords } from "../../db/schema/vocab"
import {
  userWritingLessonProgress,
  writingCurricula,
  writingLessons,
  writingSentences,
} from "../../db/schema/writing"
import {
  ACTIVITY_LOOKBACK_DAYS,
  ADMIN_DASHBOARD_LANGUAGE_CODES,
  type AdminDashboardLanguageCode,
} from "./admin-dashboard.constants"

type DayModuleCounts = { listen: number; vocab: number; writing: number }

export class AdminDashboardRepository {
  constructor(private readonly db: DbExecutor) {}

  async countUsers() {
    const rows = await this.db.select({ value: count() }).from(user)
    return Number(rows[0]?.value ?? 0)
  }

  async countUsersActive7d(since: Date) {
    const active = new Set<string>()
    const [listenUsers, vocabUsers, writingUsers] = await Promise.all([
      this.db
        .selectDistinct({ userId: userListenLessonProgress.userId })
        .from(userListenLessonProgress)
        .where(gte(userListenLessonProgress.updatedAt, since)),
      this.db
        .selectDistinct({ userId: userVocabLessonProgress.userId })
        .from(userVocabLessonProgress)
        .where(gte(userVocabLessonProgress.updatedAt, since)),
      this.db
        .selectDistinct({ userId: userWritingLessonProgress.userId })
        .from(userWritingLessonProgress)
        .where(gte(userWritingLessonProgress.updatedAt, since)),
    ])
    for (const row of [...listenUsers, ...vocabUsers, ...writingUsers]) {
      active.add(row.userId)
    }
    return active.size
  }

  async countProgressEventsSince(since: Date) {
    const listen = await this.db
      .select({ value: count() })
      .from(userListenLessonProgress)
      .where(gte(userListenLessonProgress.updatedAt, since))
    const vocab = await this.db
      .select({ value: count() })
      .from(userVocabLessonProgress)
      .where(gte(userVocabLessonProgress.updatedAt, since))
    const writing = await this.db
      .select({ value: count() })
      .from(userWritingLessonProgress)
      .where(gte(userWritingLessonProgress.updatedAt, since))
    return (
      Number(listen[0]?.value ?? 0) +
      Number(vocab[0]?.value ?? 0) +
      Number(writing[0]?.value ?? 0)
    )
  }

  async listenContentStats(languageCode: AdminDashboardLanguageCode) {
    const [categoriesRow] = await this.db
      .select({ value: count() })
      .from(listeningCategories)
      .where(eq(listeningCategories.languageCode, languageCode))
    const [sectionsRow] = await this.db
      .select({ value: count() })
      .from(listeningSections)
      .innerJoin(listeningCategories, eq(listeningSections.categoryId, listeningCategories.id))
      .where(eq(listeningCategories.languageCode, languageCode))
    const published = await this.db
      .select({ value: count() })
      .from(listeningLessons)
      .where(
        and(
          eq(listeningLessons.languageCode, languageCode),
          eq(listeningLessons.isPublished, true),
        ),
      )
    const draft = await this.db
      .select({ value: count() })
      .from(listeningLessons)
      .where(
        and(
          eq(listeningLessons.languageCode, languageCode),
          eq(listeningLessons.isPublished, false),
        ),
      )
    const missingAudio = await this.db
      .select({ value: count() })
      .from(listeningLessons)
      .where(
        and(
          eq(listeningLessons.languageCode, languageCode),
          eq(listeningLessons.isPublished, true),
          or(isNull(listeningLessons.audioStorageKey), eq(listeningLessons.audioStorageKey, "")),
        ),
      )
    return {
      categories: Number(categoriesRow?.value ?? 0),
      sections: Number(sectionsRow?.value ?? 0),
      lessonsPublished: Number(published[0]?.value ?? 0),
      lessonsDraft: Number(draft[0]?.value ?? 0),
      lessonsMissingAudio: Number(missingAudio[0]?.value ?? 0),
    }
  }

  async vocabContentStats(languageCode: AdminDashboardLanguageCode) {
    const [levelsRow] = await this.db
      .select({ value: count() })
      .from(vocabCurricula)
      .where(eq(vocabCurricula.languageCode, languageCode))
    const [lessonsRow] = await this.db
      .select({ value: count() })
      .from(vocabLessons)
      .where(eq(vocabLessons.languageCode, languageCode))
    const [wordsRow] = await this.db
      .select({ value: count() })
      .from(vocabWords)
      .innerJoin(vocabLessons, eq(vocabWords.lessonId, vocabLessons.id))
      .where(eq(vocabLessons.languageCode, languageCode))
    const levels = Number(levelsRow?.value ?? 0)
    if (levels === 0 && Number(lessonsRow?.value ?? 0) === 0) return null
    return {
      levels,
      lessons: Number(lessonsRow?.value ?? 0),
      words: Number(wordsRow?.value ?? 0),
    }
  }

  async writingContentStats(languageCode: AdminDashboardLanguageCode) {
    const [lessonsRow] = await this.db
      .select({ value: count() })
      .from(writingLessons)
      .where(eq(writingLessons.languageCode, languageCode))
    const [sentencesRow] = await this.db
      .select({ value: count() })
      .from(writingSentences)
      .innerJoin(writingLessons, eq(writingSentences.lessonId, writingLessons.id))
      .where(eq(writingLessons.languageCode, languageCode))
    if (Number(lessonsRow?.value ?? 0) === 0) return null
    return {
      lessons: Number(lessonsRow?.value ?? 0),
      sentences: Number(sentencesRow?.value ?? 0),
    }
  }

  async listLanguagesWithListen(): Promise<AdminDashboardLanguageCode[]> {
    const rows = await this.db
      .selectDistinct({ code: listeningCategories.languageCode })
      .from(listeningCategories)
    return rows
      .map((r) => r.code)
      .filter((code): code is AdminDashboardLanguageCode =>
        ADMIN_DASHBOARD_LANGUAGE_CODES.includes(code as AdminDashboardLanguageCode),
      )
  }

  async listLanguagesWithVocabDb(): Promise<AdminDashboardLanguageCode[]> {
    const rows = await this.db
      .selectDistinct({ code: vocabCurricula.languageCode })
      .from(vocabCurricula)
    return rows
      .map((r) => r.code)
      .filter((code): code is AdminDashboardLanguageCode =>
        ADMIN_DASHBOARD_LANGUAGE_CODES.includes(code as AdminDashboardLanguageCode),
      )
  }

  async listLanguagesWithWritingDb(): Promise<AdminDashboardLanguageCode[]> {
    const rows = await this.db
      .selectDistinct({ code: writingCurricula.languageCode })
      .from(writingCurricula)
    return rows
      .map((r) => r.code)
      .filter((code): code is AdminDashboardLanguageCode =>
        ADMIN_DASHBOARD_LANGUAGE_CODES.includes(code as AdminDashboardLanguageCode),
      )
  }

  /** Progress row updates per UTC day × module (all languages). */
  async dailyModuleActivitySince(since: Date): Promise<Map<string, DayModuleCounts>> {
    const map = new Map<string, DayModuleCounts>()

    const bump = (day: string, module: keyof DayModuleCounts, n: number) => {
      const row = map.get(day) ?? { listen: 0, vocab: 0, writing: 0 }
      row[module] += n
      map.set(day, row)
    }

    const listenRows = await this.db.execute<{ day: string; value: number }>(sql`
      select to_char(date(${userListenLessonProgress.updatedAt} at time zone 'UTC'), 'YYYY-MM-DD') as day,
             count(*)::int as value
      from ${userListenLessonProgress}
      where ${userListenLessonProgress.updatedAt} >= ${since}
      group by 1
    `)
    for (const row of listenRows.rows) bump(row.day, "listen", Number(row.value))

    const vocabRows = await this.db.execute<{ day: string; value: number }>(sql`
      select to_char(date(${userVocabLessonProgress.updatedAt} at time zone 'UTC'), 'YYYY-MM-DD') as day,
             count(*)::int as value
      from ${userVocabLessonProgress}
      where ${userVocabLessonProgress.updatedAt} >= ${since}
      group by 1
    `)
    for (const row of vocabRows.rows) bump(row.day, "vocab", Number(row.value))

    const writingRows = await this.db.execute<{ day: string; value: number }>(sql`
      select to_char(date(${userWritingLessonProgress.updatedAt} at time zone 'UTC'), 'YYYY-MM-DD') as day,
             count(*)::int as value
      from ${userWritingLessonProgress}
      where ${userWritingLessonProgress.updatedAt} >= ${since}
      group by 1
    `)
    for (const row of writingRows.rows) bump(row.day, "writing", Number(row.value))

    return map
  }

  /** Progress updates per UTC day × language × module. */
  async dailyLanguageModuleActivitySince(
    since: Date,
  ): Promise<Map<string, Record<AdminDashboardLanguageCode, DayModuleCounts>>> {
    const map = new Map<string, Record<AdminDashboardLanguageCode, DayModuleCounts>>()

    const ensure = (day: string) => {
      let row = map.get(day)
      if (!row) {
        row = {
          en: { listen: 0, vocab: 0, writing: 0 },
          zh: { listen: 0, vocab: 0, writing: 0 },
          jp: { listen: 0, vocab: 0, writing: 0 },
        }
        map.set(day, row)
      }
      return row
    }

    const listenRows = await this.db.execute<{ day: string; language_code: string; value: number }>(
      sql`
      select to_char(date(p.updated_at at time zone 'UTC'), 'YYYY-MM-DD') as day,
             l.language_code,
             count(*)::int as value
      from ${userListenLessonProgress} p
      inner join ${listeningLessons} l on l.id = p.lesson_id
      where p.updated_at >= ${since}
      group by 1, 2
    `,
    )
    for (const row of listenRows.rows) {
      const lang = row.language_code as AdminDashboardLanguageCode
      if (!ADMIN_DASHBOARD_LANGUAGE_CODES.includes(lang)) continue
      ensure(row.day)[lang].listen += Number(row.value)
    }

    const vocabRows = await this.db.execute<{ day: string; language_code: string; value: number }>(
      sql`
      select to_char(date(p.updated_at at time zone 'UTC'), 'YYYY-MM-DD') as day,
             l.language_code,
             count(*)::int as value
      from ${userVocabLessonProgress} p
      inner join ${vocabLessons} l on l.id = p.lesson_id
      where p.updated_at >= ${since}
      group by 1, 2
    `,
    )
    for (const row of vocabRows.rows) {
      const lang = row.language_code as AdminDashboardLanguageCode
      if (!ADMIN_DASHBOARD_LANGUAGE_CODES.includes(lang)) continue
      ensure(row.day)[lang].vocab += Number(row.value)
    }

    const writingRows = await this.db.execute<{ day: string; language_code: string; value: number }>(
      sql`
      select to_char(date(p.updated_at at time zone 'UTC'), 'YYYY-MM-DD') as day,
             l.language_code,
             count(*)::int as value
      from ${userWritingLessonProgress} p
      inner join ${writingLessons} l on l.id = p.lesson_id
      where p.updated_at >= ${since}
      group by 1, 2
    `,
    )
    for (const row of writingRows.rows) {
      const lang = row.language_code as AdminDashboardLanguageCode
      if (!ADMIN_DASHBOARD_LANGUAGE_CODES.includes(lang)) continue
      ensure(row.day)[lang].writing += Number(row.value)
    }

    return map
  }

  static activitySinceDate(): Date {
    const since = new Date()
    since.setUTCDate(since.getUTCDate() - (ACTIVITY_LOOKBACK_DAYS - 1))
    since.setUTCHours(0, 0, 0, 0)
    return since
  }
}
