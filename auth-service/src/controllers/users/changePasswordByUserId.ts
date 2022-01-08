import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import bcrypt from "bcryptjs";

import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/util/validateYupSchema";
import { hashPassword } from "#root/util/hashPassword";

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
            field: "userId",
            message: "User not found.",
          },
          {
            field: "password",
            message: "User not found.",
          },
        ],
      });
    }

    user.password = await hashPassword(password);
    await user.save();

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
      errors: [{ field: "service", message: "Something went wrong" }],
    });
  }
}
