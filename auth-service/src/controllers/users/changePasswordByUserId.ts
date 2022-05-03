import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { hashPassword } from "#root/utils/hashPassword";
import { createActivityLog } from "#root/utils/createActivityLog";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    userId: yup.string().required("UserId is required"),
    clientId: yup.string().required("ClientId is required"),
  }),
  body: yup.object().shape({
    password: yup.string().required("Password is required"),
  }),
});

export async function changePasswordByUserId(req: Request, res: Response, next: NextFunction) {
  const { body, variables } = req.body;

  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { password } = body;
  const { userId, clientId } = variables;
  try {
    const user = await User.findOne({ where: { userId: userId, clientId: clientId } });

    if (!user) {
      return res.json({
        statusCode: 403,
        data: null,
        errors: [
          {
            propertyPath: "userId",
            message: "User not found.",
          },
          {
            propertyPath: "password",
            message: "User not found.",
          },
        ],
      });
    }

    user.password = await hashPassword(password);
    await user.save();

    createActivityLog({
      clientId: variables?.clientId,
      userId: variables?.userId,
      action: "profile-change-password",
      description: `Changed user password ${user.firstName} ${user.lastName}:${user.userId}`,
    }).then(() => {
      log.info(`Activity log created for user ${user?.userId}`);
    });

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Password has been successfully changed.",
      },
      errors: [],
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong" }],
    });
  }
}
