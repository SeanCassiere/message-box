import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/util/validateYupSchema";

import User from "#root/db/entities/User";
import EmailConfirmations from "#root/db/entities/EmailConfirmations";
import { hashPassword } from "#root/util/hashPassword";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    token: yup.string().required("Token is required"),
    password: yup.string().required("Password is required"),
  }),
});

export async function resetPasswordByToken(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  try {
    const emailConfirmation = await EmailConfirmations.findOne({
      where: { confirmationId: req.body.body.token, is_used: false },
    });
    if (!emailConfirmation) {
      return res.json({
        statusCode: 400,
        data: {
          success: false,
          message: "Token failed",
        },
        errors: [
          { propertyPath: "password", message: "Token is invalid" },
          { propertyPath: "token", message: "Token is invalid" },
        ],
      });
    }
    const user = await User.findOne({ where: { userId: emailConfirmation.userId } });

    if (!user) {
      return res.json({
        statusCode: 400,
        data: {
          success: false,
          message: "User missing",
        },
        errors: [
          { propertyPath: "password", message: "User missing" },
          { propertyPath: "token", message: "User missing" },
        ],
      });
    }

    user.password = await hashPassword(req.body.body.password);
    await user.save();

    emailConfirmation.is_used = true;
    await emailConfirmation.save();

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Password changed",
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [
        { propertyPath: "service", message: "Something went wrong with the user password reset request method" },
      ],
    });
  }
}
