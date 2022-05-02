import { Request, Response } from "express";
import * as yup from "yup";

import ActivityLog from "#root/db/entities/ActivityLog";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    action: yup.string().required("Activity is required"),
    description: yup.string().required("Description is required"),
  }),
});

export async function createActivityLog(req: Request, res: Response) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      pagination: null,
      errors: checkErrors,
    });
  }

  const variables = req.body.variables;
  const body = req.body.body;

  await createDbActivityLog({
    action: body.action,
    description: body.description,
    clientId: variables.clientId,
    userId: variables.userId,
  });

  return res.json({
    statusCode: 200,
    data: true,
    errors: [],
    pagination: null,
  });
}
