import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import Task from "#root/db/entities/Task";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string(),
    startDate: yup.date().required("StartDate is required"),
    endDate: yup.date().required("EndDate is required"),
  }),
});

export async function procedure_GetEmployeeTasksSummary(req: Request, res: Response) {
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

  const dbQuery = Task.createQueryBuilder().where("client_id = :client_id", { client_id: body.clientId });
  dbQuery.andWhere("owner_id = :owner_id", { owner_id: body.userId });
  dbQuery.andWhere("is_deleted = :is_deleted", { is_deleted: false });
  dbQuery.andWhere("due_date >= :startDate", { startDate: new Date(body.startDate).toISOString() });
  dbQuery.andWhere("due_date <= :endDate", { endDate: new Date(body.endDate).toISOString() });
  dbQuery.orderBy("due_date", "ASC");

  try {
    const results = await dbQuery.getMany();
    const mapped = results.map((result) => ({
      id: result.taskId,
      name: users.find((u) => u.userId === result.ownerId)?.fullName ?? "NO NAME",
      taskName: result.title,
      isCompleted: result.isCompleted ? "Yes" : "No",
      dueDate: result.dueDate,
      completedDate: result.completedDate,
    }));
    const summary = mapped.reduce(
      (acc, curr) => {
        acc.totalTasks++;
        if (curr.isCompleted === "Yes") {
          acc.completedTasks++;
        }
        return acc;
      },
      { totalTasks: 0, completedTasks: 0 }
    );
    const summaryRow = {
      id: "-1",
      name: "--Summary--",
      taskName: "",
      isCompleted: `${summary.completedTasks}/${summary.totalTasks}`,
      dueDate: null,
      completedDate: null,
    };

    const allRows = [...mapped];
    if (allRows.length > 0) {
      allRows.push(summaryRow as any);
    }

    return res.json({
      statusCode: 200,
      data: allRows,
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
