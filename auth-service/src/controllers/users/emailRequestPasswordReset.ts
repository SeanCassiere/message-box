import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/util/validateYupSchema";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
  }),
});

export async function emailRequestPasswordReset(req: Request, res: Response, next: NextFunction) {
  const { body } = req.body;

  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { email } = body;
  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.json({
        statusCode: 200,
        data: {
          success: true,
          message: "A link to reset your password has been sent to your email.",
        },
        errors: [],
      });
    }
  } catch (err) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong" }],
    });
  }
}
