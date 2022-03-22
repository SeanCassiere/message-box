/**
 * Used get an access_token using the 2FA code
 */
import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import speakeasy from "speakeasy";

import User from "#root/db/entities/User";
import TwoFactorAuthMapping from "#root/db/entities/TwoFactorAuthMapping";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { Secret2FA } from "#root/interfaces/2FA.interfaces";
import { generateJWT } from "#root/utils/generateJWT";
import { generate2faSecret } from "#root/utils/generate2faSecret";
import Token from "#root/db/entities/Token";
import { redis } from "#root/redis";
import { REDIS_CONSTANTS } from "#root/utils/redisConstants";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    userId: yup.string().required("UserId is required"),
    code: yup.string().required("Code is required"),
  }),
});

export async function getAccessTokenFor2FACode(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 401,
      pagination: null,
      data: null,
      errors: checkErrors,
    });
  }

  const { userId, code } = req.body.body;

  try {
    // find the user
    const user = await User.findOne({ where: { userId: userId } });

    if (!user) {
      return res.json({
        statusCode: 200,
        pagination: null,
        data: {
          message: "User does not exist",
          accessToken: null,
          expiresIn: 0,
        },
        errors: [],
      });
    }
    // passwordless temporary one-time pin check
    let isPasswordPinSuccess = false;
    const pin = await redis.get(`${REDIS_CONSTANTS.PASSWORDLESS}:${user.userId}`);
    // check the pin against any available passwordless pin
    if (pin && code === pin) {
      log.info(`${user.userId} logged-in using a  passwordless pin`);
      isPasswordPinSuccess = true;
    }

    // if passwordlessPin did not succeed, check the 2fa code
    if (!isPasswordPinSuccess) {
      // the 2fa record
      let secretRecord: TwoFactorAuthMapping;
      const findUser2FARecord = await TwoFactorAuthMapping.findOne({ where: { userId: userId, is_temp: false } });

      // if user does not have a 2fa record, create one
      if (!findUser2FARecord || !user.is2faActive) {
        const tempSecret = generate2faSecret({ email: user.email });
        const newSecretRecord = await TwoFactorAuthMapping.create({
          userId,
          secret: JSON.stringify(tempSecret),
        }).save();
        secretRecord = newSecretRecord;

        return res.json({
          statusCode: 200,
          pagination: null,
          data: {
            message: "This account is not setup for 2FA authentication",
            accessToken: null,
            expiresIn: 0,
          },
          errors: [],
        });
      }

      // continue with validation the two-factor code
      secretRecord = findUser2FARecord;
      const fullUserSecret = JSON.parse(secretRecord.secret) as Secret2FA;
      const isTotpValid = speakeasy.totp.verify({ secret: fullUserSecret.base32, encoding: "base32", token: code });

      if (!isTotpValid) {
        return res.json({
          statusCode: 400,
          pagination: null,
          data: {
            message: "2FA Code is invalid",
            accessToken: null,
            expiresIn: 0,
          },
          errors: [{ propertyPath: "code", message: "Two-factor code is invalid" }],
        });
      }
    }

    // return the access token
    const accessToken = await generateJWT(user, "10min");

    const newRefreshTokenObject = Token.create({ userId: user.userId });
    newRefreshTokenObject.appendRefreshToken();
    await newRefreshTokenObject.save();
    newRefreshTokenObject.reload();

    return res.json({
      statusCode: 200,
      pagination: null,
      data: {
        message: "Successfully logged in",
        accessToken: accessToken,
        tokenType: "Bearer",
        expiresIn: 10 * 60,
        refreshToken: newRefreshTokenObject.token,
        refreshExpiresAt: newRefreshTokenObject.expiresAt,
      },
      errors: [],
    });
  } catch (e) {
    return res.json({
      statusCode: 500,
      pagination: null,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the 2fa code login method" }],
    });
  }
}
