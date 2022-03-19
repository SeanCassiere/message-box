import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";

import EmailConfirmations from "#root/db/entities/EmailConfirmations";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    confirmationId: yup.string().required("confirmationId is required"),
  }),
});

export async function markEmailConfirmationIdAsUsed(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { body } = req.body;

  try {
    const findConfirmation = await EmailConfirmations.findOne({ where: { confirmationId: body.confirmationId } });

    if (findConfirmation) {
      findConfirmation.is_used = true;
      await findConfirmation.save();
    }

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Successfully delete the task",
      },
      errors: [],
      pagination: null,
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [
        {
          propertyPath: "service",
          message: "Something went wrong with the user mark as used confirmation email method",
        },
      ],
    });
  }
}
