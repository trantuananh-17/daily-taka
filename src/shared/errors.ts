export class AppError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message)
    this.name = new.target.name
    this.code = code
    this.status = status
    this.details = details
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found.`, 404)
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
