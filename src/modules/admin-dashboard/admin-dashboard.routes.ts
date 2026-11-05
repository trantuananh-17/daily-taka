import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { db } from "../../db/client"
import { adminDashboardSummarySchema } from "./admin-dashboard.summary.schema"
import { AdminDashboardRepository } from "./admin-dashboard.repository"
import { AdminDashboardService } from "./admin-dashboard.service"

export function createAdminDashboardRoutes() {
  const app = new Hono<AppEnv>()

  app.get("/summary", async (c) => {
    const service = new AdminDashboardService(new AdminDashboardRepository(db))
    const summary = await service.getSummary()
    return c.json(adminDashboardSummarySchema.parse(summary))
  })

  return app
}
