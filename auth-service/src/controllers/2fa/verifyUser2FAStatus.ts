/**
 * Used to verify the user's 2fa code
 */
import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import speakeasy from "speakeasy";

import User from "#root/db/entities/User";
import TwoFactorAuthMapping from "#root/db/entities/TwoFactorAuthMapping";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { Secret2FA } from "#root/interfaces/2FA.interfaces";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    userId: yup.string().required("UserId is required"),
    code: yup.string().required("Code is required"),
  }),
});

export async function verifyUser2FAStatus(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      pagination: null,
      data: null,
      errors: checkErrors,
    });
  }

  const { userId, code } = req.body.body;

  try {
    const userRecord = await User.findOne({ where: { userId: userId } });
    const secretRecord = await TwoFactorAuthMapping.findOne({ where: { userId: userId, is_temp: true } });
    const existingPrimarySecret = await TwoFactorAuthMapping.find({ where: { userId: userId, is_temp: false } });

    if (!userRecord || !secretRecord) {
      return res.json({
        statusCode: 200,
        pagination: null,
        data: {
          success: false,
          message: "This account is not ready to be 2fa verified",
        },
        errors: [],
      });
    }

    /**
     * If the user is already using 2fa, dummy success
     */
    // if (userRecord.is2faActive) {
    //   return res.json({
    //     statusCode: 200,
    //     pagination: null,
    //     data: {
    //       success: true,
    //       message: "Successfully confirmed your 2fa registration",
    //     },
    //     errors: [],
    //   });
    // }

    /**
     * Check code success
     */
    const fullUserSecret = JSON.parse(secretRecord.secret) as Secret2FA;
    const isTotpValid = speakeasy.totp.verify({ secret: fullUserSecret.base32, encoding: "base32", token: code });

    if (isTotpValid) {
      // delete any existing primary secrets
      for (const sec of existingPrimarySecret) {
        await sec.remove();
      }

      // Set the temp secret to the main secret
      secretRecord.is_temp = false;
      await secretRecord.save();

      // Set the user to active
      userRecord.is2faActive = true;
      await userRecord.save();

      return res.json({
        statusCode: 200,
        pagination: null,
        data: {
          success: true,
          message: "Successfully confirmed your 2fa registration",
        },
        errors: [],
      });
    } else {
      return res.json({
        statusCode: 400,
        pagination: null,
        data: {
          success: false,
          message: "Invalid 2fa code, please try again",
        },
        errors: [{ propertyPath: "code", message: "Invalid 2fa code, please try again" }],
      });
    }
  } catch (err) {
    return res.json({
      statusCode: 500,
      pagination: null,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the 2FA verification method" }],
    });
  }
}
