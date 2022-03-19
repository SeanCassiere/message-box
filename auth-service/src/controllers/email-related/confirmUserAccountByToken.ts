import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import EmailConfirmations from "#root/db/entities/EmailConfirmations";
import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/utils/validateYupSchema";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    token: yup.string().required("Token is required"),
  }),
});

export async function confirmUserAccountByToken(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }
  const { body } = req.body;
  const { token } = body;

  try {
    const findConfirmation = await EmailConfirmations.findOne({ where: { confirmationId: token, is_used: false } });
    if (!findConfirmation) {
      return res.json({ statusCode: 200, data: { success: false, message: "Invalid token" }, errors: [] });
    }

    const findUser = await User.findOne({ where: { userId: findConfirmation.userId } });

    if (!findUser) {
      return res.json({ statusCode: 200, data: { success: false, message: "User not found" }, errors: [] });
    }

    findConfirmation.is_used = true;
    await findConfirmation.save();

    findUser.isEmailConfirmed = true;
    await findUser.save();

    return res.json({ statusCode: 200, data: { success: true, message: "Account confirmed" }, errors: [] });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong when trying to get the client profile" }],
    });
  }
}
