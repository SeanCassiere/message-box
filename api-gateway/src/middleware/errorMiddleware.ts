import express from "express";

export async function authorizationErrorMiddleware(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid access token" });
  }
  next();
}

export function notFoundMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export const errorHandlerMiddleware = (
  err: Error,
  _: express.Request,
  res: express.Response,
  __: express.NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
  });
};
