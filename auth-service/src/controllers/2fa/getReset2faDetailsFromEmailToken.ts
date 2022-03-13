import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import EmailConfirmations from "#root/db/entities/EmailConfirmations";
import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/util/validateYupSchema";
import TwoFactorAuthMapping from "#root/db/entities/TwoFactorAuthMapping";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    token: yup.string().required("Token is required"),
  }),
});

export async function getReset2faDetailsFromEmailToken(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }
  const { body } = req.body;
  const { token } = body;

  try {
    const findConfirmation = await EmailConfirmations.findOne({ where: { confirmationId: token, is_used: false } });
    if (!findConfirmation) {
      return res.json({
        statusCode: 400,
        data: { success: false, message: "Invalid token" },
        errors: [{ propertyPath: "token", message: "Confirmation is not available" }],
      });
    }

    const findTemp2faMapping = await TwoFactorAuthMapping.findOne({
      where: { mappingId: findConfirmation.userId, is_temp: true },
    });

    if (!findTemp2faMapping) {
      return res.json({
        statusCode: 400,
        data: { success: false, message: "Invalid token" },
        errors: [{ propertyPath: "token", message: "Token mapping is not available" }],
      });
    }

    const speakeasySecret = JSON.parse(findTemp2faMapping.secret) as { base32: string; otpauth_url: string };

    return res.json({
      statusCode: 200,
      pagination: null,
      data: {
        key: "/2fa/verify",
        message:
          "Your account, does not have two-factor authentication setup, please setup your two-factor authentication",
        userId: findTemp2faMapping.userId,
        secret: {
          base32: speakeasySecret.base32,
          otpauth_url: speakeasySecret.otpauth_url,
        },
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong when trying to get the client profile" }],
    });
  }
}
