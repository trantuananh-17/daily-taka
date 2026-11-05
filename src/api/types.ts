import type { Context } from "hono"

import type { Logger } from "../shared/logger"

export interface AppVariables {
  requestId: string
  logger: Logger
  userId?: string
}

export type AppEnv = { Variables: AppVariables }
export type AppContext = Context<AppEnv>
