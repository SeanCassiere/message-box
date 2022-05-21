import { Request, Response } from "express";
import * as yup from "yup";

import Task from "#root/db/entities/Task";
import {
  getLastDateOfMonth,
  getSaturdayOfCurrentWeek,
  getStartDateOfMonth,
  getSundayOfCurrentWeek,
} from "#root/utils/minorUtils";
import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    ownerId: yup.string().required("UserId is required"),
    clientDate: yup.date().required("ClientDate is required"),
    timePeriod: yup.string().required("TimePeriod is required"),
  }),
});

function findTimePeriod(audience: string) {
  switch (audience.toLowerCase().trim()) {
    case "week":
      return "week";
    case "month":
    default:
      return "month";
  }
}

export async function getEmployeeTaskCompletion(req: Request, res: Response) {
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

  const timePeriod = findTimePeriod(body?.timePeriod);
  let startDate = new Date(body?.clientDate);
  let endDate = new Date(body?.clientDate);

  switch (timePeriod) {
    case "week":
      startDate = getSundayOfCurrentWeek(startDate);
      endDate = getSaturdayOfCurrentWeek(endDate);
      break;
    case "month":
    default:
      startDate = getStartDateOfMonth(startDate);
      endDate = getLastDateOfMonth(endDate);
      break;
  }

  const dbQuery = Task.createQueryBuilder();

  dbQuery.where("owner_id = :ownerId", { ownerId: body.ownerId });
  dbQuery.andWhere("client_id = :clientId", { clientId: variables.clientId });
  dbQuery.andWhere("due_date >= :startDate", { startDate: startDate });
  dbQuery.andWhere("due_date <= :endDate", { endDate: endDate });

  try {
    const tasks = await dbQuery.getMany();

    const complete = tasks.filter((t) => t.isCompleted === true);
    const incomplete = tasks.filter((t) => t.isCompleted === false);

    const data = [
      { name: "Completed", value: complete.length },
      { name: "In-Complete", value: incomplete.length },
    ];

    return res.json({
      statusCode: 200,
      data,
      pagination: null,
      errors: [],
    });
  } catch (error) {
    log.error("FAILED on getEmployeeTaskCompletion statistics", error);
    return res.json({
      statusCode: 200,
      data: [{ name: "Completed", value: 0 }],
      errors: [],
    });
  }
}
