import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";

import User from "#root/db/entities/User";
import EmailConfirmations from "#root/db/entities/EmailConfirmations";
import { sendEmail } from "#root/email/sendEmail";
import { generatePasswordResetRequestTemplate } from "#root/email/generatePasswordResetRequestTemplate";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    host: yup.string().required("Host is required"),
    path: yup.string().required("Path is required"),
  }),
  body: yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
  }),
});

export async function requestPasswordByEmail(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  try {
    const user = await User.findOne({ where: { email: req.body.body.email.toLowerCase() } });

    if (!user) {
      return res.json({
        statusCode: 200,
        data: {
          success: true,
          message: "Email sent",
        },
        errors: [],
      });
    }

    const emailConfirmation = await EmailConfirmations.create({ userId: user?.userId, type: "password_reset" }).save();
    await sendEmail({
      recipient: user?.email,
      subject: "Password Reset",
      html: generatePasswordResetRequestTemplate({
        host: req.body.variables.host,
        path: req.body.variables.path,
        token: emailConfirmation.confirmationId,
      }),
    });
    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Email sent",
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
