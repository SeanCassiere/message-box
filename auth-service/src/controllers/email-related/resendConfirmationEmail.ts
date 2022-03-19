import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";

import User from "#root/db/entities/User";
import EmailConfirmations from "#root/db/entities/EmailConfirmations";

import { generateEmailConfirmationTemplate } from "#root/email/generateEmailConfirmationTemplate";
import { sendEmail } from "#root/email/sendEmail";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    host: yup.string().required("Host is required"),
    path: yup.string().required("Path is required"),
  }),
  body: yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
  }),
});

export async function resendConfirmationEmail(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { body, variables } = req.body;

  try {
    const user = await User.findOne({ where: { email: body.email.toLowerCase() } });

    if (!user) {
      return res.json({
        statusCode: 200,
        data: {
          success: false,
          message: "Email not found",
        },
        errors: [{ propertyPath: "email", message: "Email not found" }],
      });
    }

    const existingConfirmationRequests = await EmailConfirmations.find({
      where: { userId: user?.userId, type: "account_confirmation", is_used: false },
    });
    for (const prevConn of existingConfirmationRequests) {
      prevConn.is_used = true;
      await prevConn.save();
    }

    const newConfirmation = await EmailConfirmations.create({
      userId: user.userId,
      type: "account_confirmation",
    }).save();
    await sendEmail({
      recipient: user.email,
      subject: "Confirm Account",
      html: generateEmailConfirmationTemplate({
        host: variables.host,
        path: variables.path,
        token: newConfirmation.confirmationId,
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
        { propertyPath: "service", message: "Something went wrong with the user confirm email resend request method" },
      ],
    });
  }
}
