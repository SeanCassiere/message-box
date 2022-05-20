import { Request, Response } from "express";
import * as yup from "yup";

import DashboardWidget from "#root/db/entities/DashboardWidget";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    forClient: yup.string().required("ForClient is required"),
  }),
  body: yup.object().shape({
    widgets: yup.array().of(
      yup.object().shape({
        id: yup.string().required("Widget id is required"),
        x: yup.number().required("Widget x position is required"),
        y: yup.number().required("Widget y position is required"),
      })
    ),
  }),
});

export async function patchWidgetPositions(req: Request, res: Response) {
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

  try {
    const widgetsFromDb = await DashboardWidget.find({
      where: { clientId: variables.clientId, userId: variables.userId, forClient: variables.forClient },
    });

    const promises = [];
    for (const widget of body.widgets) {
      const dbWidget = widgetsFromDb.find((dbWidget) => `${dbWidget.id}` === `${widget.id}`);

      if (dbWidget) {
        dbWidget.x = widget.x;
        dbWidget.y = widget.y;
        promises.push(dbWidget.save());
      }
    }

    await Promise.all(promises);

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Widgets positions updated successfully",
      },
      errors: [],
    });
  } catch (error) {
    log.error(`FAILED getting dashboard widgets for userId: ${body?.ownerId}`);
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something in PATCH /dashboard/widgets" }],
    });
  }
}
