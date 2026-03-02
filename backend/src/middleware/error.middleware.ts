import type { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  status?: number;
  details?: unknown;
}

export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status ?? 500;

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  res.status(status).json({
    message: err.message || "Internal server error",
    details: err.details,
  });
}
