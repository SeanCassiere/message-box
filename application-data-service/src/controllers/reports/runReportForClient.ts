import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { REPORT_PROCEDURES } from "#root/constants/default_reports";

import { procedure_GetEmployeeLoginReportForClient } from "./procedures/GetEmployeeLoginReportForClient";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    procedure: yup.string().required("Procedure is required"),
  }),
});

export async function runReportForClient(req: Request, res: Response) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      pagination: null,
      errors: checkErrors,
    });
  }

  const { procedure } = req.body.body;

  switch (procedure) {
    case REPORT_PROCEDURES.GetEmployeeLoginReportForClient:
      return await procedure_GetEmployeeLoginReportForClient(req, res);
    default:
      return res.json({
        statusCode: 400,
        data: [],
        errors: [
          {
            propertyPath: "procedure",
            message: "Procedure not found",
          },
        ],
        pagination: null,
      });
  }
}
