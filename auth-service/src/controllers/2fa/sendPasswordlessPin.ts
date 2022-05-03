import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import { generatePasswordlessPin } from "#root/utils/generatePasswordlessPin";
import { redis } from "#root/redis";
import { REDIS_CONSTANTS } from "#root/utils/redisConstants";
import { sendEmail } from "#root/email/sendEmail";
import { generatePasswordlessPinEmailTemplate } from "#root/email/generatePasswordlessPinEmailTemplate";
import { createActivityLog } from "#root/utils/createActivityLog";

const supportedMethods = ["email"];

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    method: yup.string().oneOf(supportedMethods, "Method is not supported").required("Method is required"),
    userId: yup.string().required("UserId is required"),
  }),
});

export async function sendPasswordlessPin(req: Request, res: Response, next: NextFunction) {
  const { body } = req.body;

  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { userId, method } = body;

  let user: User | null = null;

  try {
    const findUser = await User.findOne({
      where: { userId: userId, isActive: true, is2faActive: true, isEmailConfirmed: true },
    });
    user = findUser ?? null;
  } catch (error) {
    log.warn(`Error while finding user with userId: ${userId}`, error);
  }

  if (!user) {
    return res.json({
      statusCode: 400,
      data: {
        success: false,
      },
      errors: [{ propertyPath: "userId", message: "User does not exist" }],
    });
  }

  let sentPin = false;
  const pin = `${generatePasswordlessPin()}`;

  if (method.toLowerCase() === "email") {
    await redis.set(`${REDIS_CONSTANTS.PASSWORDLESS}:${user.userId}`, pin, "ex", 60 * 15);

    try {
      await sendEmail({
        recipient: user.email,
        subject: "One-Time PIN",
        html: generatePasswordlessPinEmailTemplate({ code: pin }),
      });

      createActivityLog({
        clientId: user.clientId,
        userId: user.userId,
        action: "login-passwordless",
        description: "Sent passwordless pin",
      }).then(() => {
        log.info(`Activity log created for userId: ${user?.userId}`);
      });

      return res.json({ statusCode: 200, data: { success: true, message: "PIN has been sent" }, errors: [] });
    } catch (error) {
      log.error(`Could not send email to ${user.email} (sendPasswordlessPin)`);
      log.error(error);
    }
  }

  if (!sentPin) {
    return res.json({
      statusCode: 200,
      data: {
        success: false,
        message: "PIN could not be sent",
      },
      errors: [],
    });
  }

  return res.json({
    statusCode: 200,
    data: {
      success: true,
      message: "PIN has been sent",
    },
    errors: [],
  });
}
