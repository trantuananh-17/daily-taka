import { eq } from "drizzle-orm"

import type { DbExecutor } from "../../db/client"
import { userSettings, type UserSettingsRow } from "../../db/schema/user-learning"

export class UserSettingsRepository {
  constructor(private readonly db: DbExecutor) {}

  async findByUserId(userId: string): Promise<UserSettingsRow | null> {
    const rows = await this.db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)
    return rows[0] ?? null
  }

  async upsertPreferences(userId: string, preferences: Record<string, unknown>): Promise<UserSettingsRow> {
    const now = new Date()
    const rows = await this.db
      .insert(userSettings)
      .values({ userId, preferences, updatedAt: now })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { preferences, updatedAt: now },
      })
      .returning()
    return rows[0]!
  }
}
