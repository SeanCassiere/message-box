import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/utils/validateYupSchema";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
  }),
});

export async function getAllBaseUsersForClient(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }
  const variables = req.body.variables;

  try {
    const users = await User.find({
      where: { clientId: variables.clientId, isActive: true },
      select: ["userId", "firstName", "lastName", "email"],
    });
    return res.json({
      statusCode: 200,
      data: [...users],
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 200,
      data: [],
      errors: [],
    });
  }
}
