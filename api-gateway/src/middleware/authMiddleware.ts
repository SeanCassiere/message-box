import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import jwkClient from "jwks-rsa";
import jwkToPem, { JWK } from "jwk-to-pem";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { log } from "#root/utils/logger";

/**
 * @deprecated
 * @param req
 * @param res
 * @param next
 * @returns next()
 */
export async function validateToken(req: CustomRequest<{}>, res: Response, next: NextFunction) {
  let token = "";

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const client = jwkClient({
        jwksUri: `http://auth-service:4000/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
      });
      const keys = await client.getKeys();
      const keysArray = Array.from(keys as any);
      const usableKey = keysArray[0] as JWK;
      // console.log(usableKey);
      const publicKey = jwkToPem(usableKey);

      const tokenPayload = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as {
        message_box_clientId: string;
        message_box_userId: string;
      };
      req.user = tokenPayload;

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  if (token.length === 0) {
    res.status(401).json({ message: "Missing token" });
  }
  return next();
}

export const socketTokenAuth = async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  let token = "";
  log.info(`Verifying token for socket id ( ${socket.id} )`);
  if (socket.handshake?.auth?.token) {
    try {
      token = socket.handshake.auth.token;
      const initJwksClient = jwkClient({
        jwksUri: `http://auth-service:4000/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
      });

      const keys = await initJwksClient.getKeys();
      const keysArray = Array.from(keys as any);
      const usableKey = keysArray[0] as JWK;
      const publicKey = jwkToPem(usableKey);

      const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as {
        message_box_clientId: string;
        message_box_userId: string;
      };

      log.info(`Access token verified for socket id ( ${socket.id} )`);
      socket.handshake.auth.userId = decoded.message_box_userId;
      socket.handshake.auth.clientId = decoded.message_box_clientId;
      next();
    } catch (e) {
      log.warn(`Authorization failed for socket id ( ${socket.id} )`);
      const err = new Error("authorization failed") as any;
      err.data = { content: "Authorization failed, please retry later", type: "authentication_error" }; // additional details
      next(err);
    }
  } else {
    const err = new Error("auth.token not provided") as any;
    err.data = { content: "handshake.auth.token not provided, please retry later", type: "authentication_error" }; // additional details
    log.warn(`Disconnecting socket ( ${socket.id} ); Reason: auth.token not provided`);
    next(err);
  }
};
