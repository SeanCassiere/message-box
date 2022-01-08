/**
 * /users/login
 */
import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import bcrypt from "bcryptjs";

import User from "#root/db/entities/User";
import TwoFactorAuthMapping from "#root/db/entities/TwoFactorAuthMapping";

import { validateYupSchema } from "#root/util/validateYupSchema";
import { generate2faSecret } from "#root/util/generate2faSecret";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  }),
});

export async function emailAndPasswordLogin2FA(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      pagination: null,
      data: null,
      errors: checkErrors,
    });
  }

  const { email, password } = req.body.body;

  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (user) {
      if (!user.isEmailConfirmed || !user.isActive) {
        const messageBack = user.isActive === false ? "This account has been locked out" : "Email is not confirmed";
        return res.json({
          statusCode: 400,
          pagination: null,
          data: null,
          errors: [{ propertyPath: "email", message: messageBack }],
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        if (user.is2faActive) {
          /**
           * Tell the gateway to redirect the user to the 2fa login page
           */
          return res.json({
            statusCode: 200,
            pagination: null,
            data: {
              key: "/2fa/login",
              message: "Credentials are valid, please validate your two-factor authentication code",
              userId: user.userId,
              secret: null,
            },
            errors: [],
          });
        } else {
          const existingTemp2faRecords = await TwoFactorAuthMapping.find({
            where: { userId: user.userId, is_temp: true },
          });
          for (const removeTempRecord of existingTemp2faRecords) {
            await removeTempRecord.remove();
          }
          const existingPrimary2faRecords = await TwoFactorAuthMapping.find({
            where: { userId: user.userId, is_temp: true },
          });
          for (const removePrimaryRecord of existingPrimary2faRecords) {
            await removePrimaryRecord.remove();
          }

          // create the temp secret
          const tempSecret = generate2faSecret({ email: user.email });

          // save as temp secret to db
          await TwoFactorAuthMapping.create({ userId: user.userId, secret: JSON.stringify(tempSecret) }).save();
          /**
           * Tell the gateway to redirect the user to the 2FA validation page
           */
          return res.json({
            statusCode: 200,
            pagination: null,
            data: {
              key: "/2fa/verify",
              message:
                "Your account, does not have two-factor authentication setup, please setup your two-factor authentication",
              userId: user.userId,
              secret: {
                base32: tempSecret.base32,
                otpauth_url: tempSecret.otpauth_url,
              },
            },
            errors: [],
          });
        }
      }
    }

    return res.json({
      statusCode: 400,
      pagination: null,
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
      pagination: null,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the 2fa email-password login method" }],
    });
  }
}
