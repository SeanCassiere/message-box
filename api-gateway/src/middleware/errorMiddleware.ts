import express from "express";
import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import jwkClient from "jwks-rsa";
import jwkToPem, { JWK } from "jwk-to-pem";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { log } from "#root/utils/logger";

export async function authorizationErrorMiddleware(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid access token" });
  }
}
