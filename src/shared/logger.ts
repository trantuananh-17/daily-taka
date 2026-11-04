type LogFields = Record<string, unknown>

function write(level: string, message: string, fields?: LogFields) {
  const line = JSON.stringify({ level, message, ...fields, ts: new Date().toISOString() })
  if (level === "error") console.error(line)
  else console.log(line)
}

export const logger = {
  info(message: string, fields?: LogFields) {
    write("info", message, fields)
  },
  warn(message: string, fields?: LogFields) {
    write("warn", message, fields)
  },
  error(message: string, fields?: LogFields) {
    write("error", message, fields)
  },
  child(extra: LogFields) {
    return {
      info: (message: string, fields?: LogFields) =>
        logger.info(message, { ...extra, ...fields }),
      warn: (message: string, fields?: LogFields) =>
        logger.warn(message, { ...extra, ...fields }),
      error: (message: string, fields?: LogFields) =>
        logger.error(message, { ...extra, ...fields }),
    }
  },
}
