import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten();
      return next({
        status: 400,
        message: "Validation error",
        details: errors,
      });
    }

    req.body = result.data as unknown as T;
    next();
  };