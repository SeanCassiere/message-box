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
    forClient: yup.string().required("ForClient is required"),
  }),
  body: yup.object().shape({
    widgetType: yup.string().required("WidgetType is required"),
    widgetName: yup.string().required("WidgetName is required"),
    widgetScale: yup.number().required("WidgetScale is required"),
    isWidgetTall: yup.boolean().required("IsWidgetTall is required"),
    position: yup.object().shape({
      x: yup.number().min(0, "Minimum is 0").required("X is required"),
      y: yup.number().min(0, "Minimum is 0").required("Y is required"),
    }),
    config: yup.array().of(
      yup.object().shape({
        parameter: yup.string().required("Parameter is required"),
        value: yup.string().required("Value is required"),
      })
    ),
    variableOptions: yup.array().of(
      yup.object().shape({
        parameter: yup.string().required("Parameter is required"),
        mode: yup.string().required("Mode is required"),
      })
    ),
  }),
});

export async function createWidgetForUser(req: Request, res: Response) {
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
    const widget = await DashboardWidget.create({
      clientId: variables.clientId,
      userId: variables.userId,
      forClient: variables.forClient,
      name: body.widgetName,
      type: body.widgetType,
      scale: body.widgetScale,
      isTall: body.isWidgetTall,
      x: body.position.x,
      y: body.position.y,
      config: body.config,
      variableConfigOptions: body.variableOptions,
    }).save();

    console.log(body.config);
    console.log(body.variableOptions);

    return res.json({
      statusCode: 200,
      data: formatFullDbWidget({ widget }),
      errors: [],
    });
  } catch (error) {
    log.error(`FAILED saving a dashboard widget for userId: ${body?.ownerId}`);
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something in DELETE /dashboard/widgets/:id" }],
    });
  }
}
