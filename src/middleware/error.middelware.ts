import {
  ErrorRequestHandler,
  NextFunction,
  type Request,
  type Response,
} from "express";
import mongoose, { Error } from "mongoose";
import { AppError } from "../utils/app.error";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  void req;
  void next;
  let statusCode = 500;
  let message = "Server Error";
  let details: unknown;
  let errors:
    | Array<{ path: string; message: string; code?: string }>
    | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    details = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}`;
    details = { path: err.path, value: err.value };
  }

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Database Validation Error";
    details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === 11000
  ) {
    statusCode = 409;
    message = "Duplicate key error";
    details = (err as any).keyValue ?? (err as any).keyPattern;
  }

  res.status(statusCode).json({ message, details, errors });
};
