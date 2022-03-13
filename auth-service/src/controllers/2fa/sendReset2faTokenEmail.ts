/**
 * /users/login
 */
import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";
import TwoFactorAuthMapping from "#root/db/entities/TwoFactorAuthMapping";
import EmailConfirmations from "#root/db/entities/EmailConfirmations";

import { validateYupSchema } from "#root/util/validateYupSchema";
import { generate2faSecret } from "#root/util/generate2faSecret";
import { sendEmail } from "#root/email/sendEmail";
import { generate2faResetRequestTemplate } from "#root/email/generate2faResetRequestTemplate";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    host: yup.string().required("Host is required"),
    path: yup.string().required("Path is required"),
  }),
  body: yup.object().shape({
    userId: yup.string().required("UserId is required"),
  }),
});

export async function sendReset2faTokenEmail(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      pagination: null,
      data: null,
      errors: checkErrors,
    });
  }

  const { userId } = req.body.body;

  try {
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.json({
        statusCode: 400,
        pagination: null,
        data: null,
        errors: [{ propertyPath: "userId", message: "User does not exist" }],
      });
    }

    if (!user.isActive) {
      return res.json({
        statusCode: 400,
        pagination: null,
        data: null,
        errors: [{ propertyPath: "userId", message: "This account has been locked out" }],
      });
    }

    // begin 2fa juggling
    const existingTemp2faRecords = await TwoFactorAuthMapping.find({
      where: { userId: user.userId, is_temp: true },
    });
    for (const removeTempRecord of existingTemp2faRecords) {
      await removeTempRecord.remove();
    }

    // create the temp secret
    const tempSecret = generate2faSecret({ email: user.email });

    // save as temp secret to db
    const newTempAuthMapping = await TwoFactorAuthMapping.create({
      userId: user.userId,
      secret: JSON.stringify(tempSecret),
    }).save();

    // create email record
    const emailConfirmation = await EmailConfirmations.create({
      userId: `${newTempAuthMapping.mappingId}`,
      type: "lost_2fa_access",
    }).save();

    // send email
    await sendEmail({
      recipient: user.email,
      html: generate2faResetRequestTemplate({
        host: req.body.variables.host,
        path: req.body.variables.path,
        token: emailConfirmation.confirmationId,
      }),
      subject: "Reset your 2FA access",
    });

    /**
     * Tell the gateway to redirect the user to the 2FA validation page
     */
    return res.json({
      statusCode: 200,
      pagination: null,
      data: {
        success: true,
      },
      errors: [],
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      pagination: null,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the reset 2fa with userId method" }],
    });
  }
}
