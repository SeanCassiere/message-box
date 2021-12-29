import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";

import User from "#root/db/entities/User";
import { CustomRequest } from "#root/interfaces/Express.interfaces";

export async function jwtValidator(req: Request, res: Response, next: NextFunction) {
	let token: string = "";
	const secret = fs.readFileSync(__dirname + "/../../certs/private.pem");

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, secret, { algorithms: ["RS256"] }) as { message_box_userId: string };

			const findUser = await User.findOne({ where: { userId: decoded.message_box_userId } });

			if (!findUser) {
				return res.json({ 400: "User not found" });
			}

			req.user = findUser;
			return next();
		} catch (error) {
			return res.json({ 400: "Something went wrong" });
		}
	}
}
