import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import bcrypt from "bcryptjs";

import User from "#root/db/entities/User";
import { generateJWT, generateRefreshJWT } from "#root/util/generateJWT";
import { addMinsToCurrentDate } from "#root/util/addMinsToCurrentDate";
import { validateYupSchema } from "#root/util/validateYupSchema";

const validationSchema = yup.object().shape({
	body: yup.object().shape({
		email: yup.string().email("Must be a valid email").required("Email is required"),
		password: yup.string().required("Password is required"),
	}),
});

export async function loginUser(req: Request, res: Response, next: NextFunction) {
	const checkErrors = await validateYupSchema(validationSchema, req.body);
	if (checkErrors && checkErrors.length > 0) {
		return res.json({
			statusCode: 400,
			data: null,
			errors: checkErrors,
		});
	}

	const { email, password } = req.body.body;

	try {
		const user = await User.findOne({ where: { email: email.toLowerCase() } });

		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (isPasswordValid) {
				const accessToken = await generateJWT(user, "10min");
				const refreshToken = generateRefreshJWT(user, "18h");
				return res.json({
					statusCode: 200,
					data: {
						accessToken: accessToken,
						expiresIn: 10 * 60,
						refreshToken: refreshToken,
						refreshExpiresAt: addMinsToCurrentDate(18 * 60),
					},
					errors: [],
				});
			}
		}

		return res.json({
			statusCode: 400,
			data: null,
			errors: [
				{
					propertyPath: "email",
					message: "Username may be incorrect",
				},
				{
					propertyPath: "password",
					message: "Password may be incorrect",
				},
			],
		});
	} catch (err) {
		return res.json({
			statusCode: 500,
			data: null,
			errors: [{ propertyPath: "service", message: "Something went wrong with the login method" }],
		});
	}
}
