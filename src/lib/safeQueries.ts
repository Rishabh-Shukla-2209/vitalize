import { Prisma } from "@/generated/prisma/client";
import { DBError, AppError, AppErrorDetails } from "@/lib/errors";
import prisma from "./db";
import * as Sentry from "@sentry/nextjs";

export type SafeResult<T> = {
  data: T | null;
  error: AppError | null;
};

function extractPrismaErrorDetails(err: unknown): AppErrorDetails {
  if (typeof err === "object" && err !== null) {
    const maybe = err as Record<string, unknown>;

    return {
      code: typeof maybe.code === "string" ? maybe.code : undefined,
      cause: err,
      meta:
        typeof maybe.meta === "object" && maybe.meta !== null
          ? (maybe.meta as Record<string, unknown>)
          : undefined,
    };
  }

  return { cause: err };
}

export async function safeQuery<T>(
  fn: () => Promise<T>,
): Promise<SafeResult<T>> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err: unknown) {
    const details = extractPrismaErrorDetails(err);
    const message =
      err instanceof Error ? err.message : "Unknown database error";

    const dbErr = new DBError(message, details);

    Sentry.captureException(err);

    return { data: null, error: dbErr };
  }
}

export async function safeTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<{ data: T | null; error: DBError | null }> {
  try {
    const data = await prisma.$transaction(async (tx) => {
      return await fn(tx);
    });

    return { data, error: null };
  } catch (err: unknown) {
    const details = extractPrismaErrorDetails(err);
    const message =
      err instanceof Error ? err.message : "Unknown database transaction error";

    const dbErr = new DBError(message, details);

    Sentry.captureException(err);

    return { data: null, error: dbErr };
  }
}
