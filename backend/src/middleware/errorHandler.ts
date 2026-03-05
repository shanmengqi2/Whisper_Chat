import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error in errorHandler middleware:", err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}