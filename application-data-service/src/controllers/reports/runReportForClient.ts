import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { REPORT_PROCEDURES } from "#root/constants/default_reports";
import { log } from "#root/utils/logger";

import { procedure_GetEmployeeLoginReportForClient } from "./procedures/GetEmployeeLoginReportForClient";
import { procedure_GetEmployeeLoginReportByTeam } from "./procedures/GetEmployeeLoginReportByTeam";
import { procedure_GetEmployeeFullActivity } from "./procedures/GetEmployeeFullActivityReport";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";
import { procedure_GetEmployeeStatusChange } from "./procedures/GetEmployeeStatusChange";
import { procedure_GetEmployeeTasksSummary } from "./procedures/GetEmployeeTasksSummary";

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

  const variables = req.body.variables;
  const { procedure } = req.body.body;

  createDbActivityLog({
    clientId: variables.clientId,
    userId: variables.userId,
    action: "run-report",
    description: `Ran report procedure:${procedure}`,
  }).then(() => {
    log.info(`Activity log created for userId: ${variables?.userId}`);
  });

  switch (procedure) {
    case REPORT_PROCEDURES.GetEmployeeLoginReportForClient:
      return await procedure_GetEmployeeLoginReportForClient(req, res);
    case REPORT_PROCEDURES.GetEmployeeLoginReportByTeam:
      return await procedure_GetEmployeeLoginReportByTeam(req, res);
    case REPORT_PROCEDURES.GetEmployeeFullActivity:
      return await procedure_GetEmployeeFullActivity(req, res);
    case REPORT_PROCEDURES.GetEmployeeStatusChange:
      return await procedure_GetEmployeeStatusChange(req, res);
    case REPORT_PROCEDURES.GetEmployeeTasksSummary:
      return await procedure_GetEmployeeTasksSummary(req, res);
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
