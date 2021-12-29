import jwt from "jsonwebtoken";
import fs from "fs";

import User from "#root/db/entities/User";

export async function generateJWT(user: User, expiresIn: string) {
	const secret = fs.readFileSync(__dirname + "/../../certs/private.pem");
	return jwt.sign(
		{
			message_box_clientId: user.clientId,
			message_box_userId: user.userId,
		},
		secret,
		{ expiresIn, algorithm: "RS256" }
	);
}

export function generateRefreshJWT(user: User, expiresIn: string) {
	return jwt.sign(
		{
			message_box_clientId: user.clientId,
			message_box_userId: user.userId,
		},
		process.env.REFRESH_TOKEN_SECRET!,
		{
			expiresIn,
		}
	);
}
