import { logger } from "./shared/logger"

const log = logger.child({ process: "worker" })

log.info("worker.placeholder", {
  message: "Worker entry reserved (queues/jobs — enable when needed).",
})
