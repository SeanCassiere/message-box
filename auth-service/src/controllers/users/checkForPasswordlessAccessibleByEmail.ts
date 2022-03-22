import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/utils/validateYupSchema";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().email("Must be an email address").required("Email is required"),
  }),
});

export async function checkForPasswordlessAccessibleByEmail(req: Request, res: Response, next: NextFunction) {
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
          userId: null,
        },
        errors: [],
      });
    }

    if (!user.isEmailConfirmed) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [{ propertyPath: "email", message: "Email is not confirmed" }],
      });
    }

    if (!user.isActive) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [{ propertyPath: "email", message: "This account has been locked out" }],
      });
    }

    if (!user.is2faActive) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [{ propertyPath: "email", message: "Login to setup two-factor authentication" }],
      });
    }

    return res.json({
      statusCode: 200,
      data: {
        userId: user.userId,
      },
      errors: [],
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with check password login status method" }],
    });
  }
}
