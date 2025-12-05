export type AppErrorType =
  | "NOT_FOUND"
  | "DB_ERROR"
  | "VALIDATION_ERROR"
  | "FORBIDDEN"
  | "UNAUTHORIZED"
  | "UNKNOWN";


export interface AppErrorDetails {
  code?: string;
  cause?: unknown;
  meta?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly type: AppErrorType;
  public readonly status: number;
  public readonly details?: AppErrorDetails;

  constructor(
    type: AppErrorType,
    message: string,
    status: number,
    details?: AppErrorDetails
  ) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.status = status;
    this.details = details;
  }
}


export class NotFoundError extends AppError {
  constructor(message = "Not Found", details?: AppErrorDetails) {
    super("NOT_FOUND", message, 404, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: AppErrorDetails) {
    super("FORBIDDEN", message, 403, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation Error", details?: AppErrorDetails) {
    super("VALIDATION_ERROR", message, 400, details);
  }
}

export class DBError extends AppError {
  constructor(message = "Database Error", details?: AppErrorDetails) {
    super("DB_ERROR", message, 500, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: AppErrorDetails) {
    super("UNAUTHORIZED", message, 401, details);
  }
}

export function isAppError(e: unknown): e is AppError {
  return e instanceof AppError;
}
