import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import DashboardWidget from "#root/db/entities/DashboardWidget";
import { formatFullDbWidget } from "#root/utils/formatResponses";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    ownerId: yup.string().required("OwnerId is required"),
    forClient: yup.string().required("ForClient is required"),
  }),
});

export async function getWidgetsForUser(req: Request, res: Response) {
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

  const dbQuery = DashboardWidget.createQueryBuilder().where("client_id = :client_id", {
    client_id: variables.clientId,
  });
  dbQuery.andWhere("user_id = :user_id", { user_id: body.ownerId });
  dbQuery.andWhere("for_client = :for_client", { for_client: body.forClient });

  try {
    const widgetsFromDb = await dbQuery.getMany();
    const formattedWidgets = widgetsFromDb.map((widget) => formatFullDbWidget({ widget }));

    return res.json({
      statusCode: 200,
      data: formattedWidgets,
      errors: [],
    });
  } catch (error) {
    log.error(`FAILED getting dashboard widgets for userId: ${body?.ownerId}`);
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something in GET /dashboard/widgets" }],
    });
  }
}
