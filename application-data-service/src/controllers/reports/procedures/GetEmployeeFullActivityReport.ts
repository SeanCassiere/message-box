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
    userId: yup.string(),
    startDate: yup.date().required("StartDate is required"),
    endDate: yup.date().required("EndDate is required"),
  }),
});

export async function procedure_GetEmployeeFullActivity(req: Request, res: Response) {
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
      `POST /reports/procedure_GetEmployeeFullActivityReport -> ${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient\n
      could not fetch the user ids for this client\n
      ${error}`
    );
  }

  const dbQuery = ActivityLog.createQueryBuilder().where("client_id = :client_id", { client_id: body.clientId });
  if (body?.userId) {
    dbQuery.andWhere("user_id = :user_id", { user_id: body.userId });
  }

  dbQuery.andWhere("created_at >= :startDate", { startDate: new Date(body.startDate).toISOString() });
  dbQuery.andWhere("created_at <= :endDate", { endDate: new Date(body.endDate).toISOString() });
  dbQuery.orderBy("created_at", "ASC");

  try {
    const results = await dbQuery.getMany();
    const mapped = results.map((result) => ({
      id: result.id,
      name: users.find((u) => u.userId === result.userId)?.fullName ?? "NO NAME",
      action: result.action,
      timestamp: result.createdAt,
      description: result.description,
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
