import { Request, Response } from "express";
import * as yup from "yup";
import speakeasy from "speakeasy";

import User from "#root/db/entities/User";
import TwoFactorAuthMapping from "#root/db/entities/TwoFactorAuthMapping";

import { validateYupSchema } from "#root/util/validateYupSchema";
import { hashPassword } from "#root/util/hashPassword";
import { Secret2FA } from "#root/interfaces/2FA.interfaces";

const validationSchema = yup.object().shape({
	body: yup.object().shape({
		email: yup.string().email("Must be a valid email").required("Username is required"),
		password: yup.string().required("Password is required"),
		code: yup.string().required("Code is required"),
	}),
});

export async function changePasswordUsing2FA(req: Request, res: Response) {
	const checkErrors = await validateYupSchema(validationSchema, req.body);
	if (checkErrors && checkErrors.length > 0) {
		return res.json({
			statusCode: 400,
			pagination: null,
			data: null,
			errors: checkErrors,
		});
	}

	const { email, password, code } = req.body.body;

	// start the process
	try {
		// Check the user
		const user = await User.findOne({ where: { email: email.toLowerCase() } });

		if (!user) {
			return res.json({
				statusCode: 400,
				pagination: null,
				data: {
					success: false,
					message: "User does not exist",
				},
				errors: [{ propertyPath: "email", message: "User does not exist" }],
			});
		}

		const primaryTwoFactorSecret = await TwoFactorAuthMapping.findOne({
			where: { userId: user.userId, is_temp: false },
		});

		if (!primaryTwoFactorSecret || user.is2faActive === false) {
			return res.json({
				statusCode: 400,
				pagination: null,
				data: {
					success: false,
					message: "This account does not have two-factor authentication enabled",
				},
				errors: [{ propertyPath: "code", message: "This account does not have two-factor authentication enabled" }],
			});
		}

		// validate the code
		const secret = JSON.parse(primaryTwoFactorSecret.secret) as Secret2FA;
		const isTotpValid = speakeasy.totp.verify({ secret: secret.base32, encoding: "base32", token: code });

		if (!isTotpValid) {
			return res.json({
				statusCode: 400,
				pagination: null,
				data: {
					success: false,
					message: "Code is invalid",
				},
				errors: [{ propertyPath: "code", message: "The code is expired, please try again" }],
			});
		}

		const newHashedPassword = await hashPassword(password);

		user.password = newHashedPassword;
		await user.save();

		return res.json({
			statusCode: 200,
			pagination: null,
			data: {
				success: true,
				message: "Successfully changed your password",
			},
			errors: [],
		});
	} catch (e) {
		return res.json({
			statusCode: 500,
			pagination: null,
			data: null,
			errors: [{ propertyPath: "service", message: "Something went wrong with the 2fa password change method" }],
		});
	}
}
