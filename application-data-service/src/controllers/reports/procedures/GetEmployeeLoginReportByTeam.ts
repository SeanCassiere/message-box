import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import ActivityLog from "#root/db/entities/ActivityLog";
import { log } from "#root/utils/logger";
import { AUTH_SERVICE_URI } from "#root/utils/constants";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    teamId: yup.string().required("TeamId is required"),
    startDate: yup.date().required("StartDate is required"),
    endDate: yup.date().required("EndDate is required"),
  }),
});

export async function procedure_GetEmployeeLoginReportByTeam(req: Request, res: Response) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      pagination: null,
      errors: checkErrors,
    });
  }

  const body = req.body.body;

  let users: any[] = [];

  try {
    let clientUsers: any[] = [];
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient`, {
      variables: {
        clientId: body.clientId,
      },
    });

    clientUsers = response.data;
    users = clientUsers.map((u) => ({ ...u, fullName: `${u.firstName} ${u.lastName}` }));
  } catch (error) {
    log.error(
      `POST /reports/procedure_GetEmployeeLoginByTeam -> ${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient\ncould not fetch the user ids for this client\n${error}`
    );
  }

  let userIdsInTeam: string[] = [];
  try {
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/teams/getUserIdsForTeamId`, {
      teamId: body.teamId,
    });

    userIdsInTeam = response.data;
    console.log("response.data", response.data);
  } catch (error) {
    log.error(
      `POST /reports/procedure_GetEmployeeLoginByTeam -> ${AUTH_SERVICE_URI}/clients/getUserIdsForTeamId\ncould not fetch the user ids for this client\n${error}`
    );
  }

  const dbQuery = ActivityLog.createQueryBuilder().where("client_id = :client_id", { client_id: body.clientId });
  dbQuery.andWhere("user_id IN (:...user_id)", { user_id: [...userIdsInTeam] });
  dbQuery.andWhere("action IN (:...actionLogin)", { actionLogin: ["login", "logout"] });

  try {
    const results = await dbQuery.getMany();
    const mapped = results.map((result) => ({
      id: result.id,
      name: users.find((u) => u.userId === result.userId)?.fullName ?? "NO NAME",
      action: result.action,
      timestamp: result.createdAt,
    }));
    return res.json({
      statusCode: 200,
      data: mapped,
      errors: [],
      pagination: null,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [{ propertyPath: "procedureName", message: "FAILED" }],
      pagination: null,
    });
  }
}
