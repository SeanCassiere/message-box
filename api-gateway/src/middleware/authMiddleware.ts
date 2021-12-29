import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import jwkClient from "jwks-rsa";
import jwkToPem, { JWK } from "jwk-to-pem";

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
			req.auth = tokenPayload;

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
