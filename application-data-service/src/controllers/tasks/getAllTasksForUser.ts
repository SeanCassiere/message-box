import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import Task from "#root/db/entities/Task";
import TaskShareMapping from "#root/db/entities/TaskShareMappings";
import { formatTaskResponseWithUsers } from "#root/utils/formatResponses";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    ownerId: yup.string().required("OwnerId is required"),
    clientDate: yup.date().required("ClientDate is required"),
    forAudience: yup.string().required("ForAudience is required"),
  }),
});

function findAudience(audience: string) {
  switch (audience.toLowerCase().trim()) {
    case "today":
      return "today";
    case "tomorrow":
      return "tomorrow";
    case "overdue":
      return "overdue";
    case "completed":
      return "completed";
    default:
      return "today";
  }
}

export async function getAllTasksForUser(req: Request, res: Response) {
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

  const audience = findAudience(body.forAudience);

  const returnFormattedTasks = [];

  try {
    // get the owned tasks
    const query = Task.createQueryBuilder()
      .select()
      .where("owner_id = :ownerId", { ownerId: body.ownerId })
      .andWhere("client_id = :clientId", { clientId: variables.clientId })
      .andWhere("is_deleted = :isDeleted", { isDeleted: false });

    // setup the search parameters based on the audience query
    if (audience === "today") {
      /**
       * get all tasks that are after the start of the clientDate
       */
      const after = new Date(body.clientDate);
      after.setUTCHours(0, 0, 0, 1);
      query.andWhere("due_date >= :after", { after: after.toISOString() });

      /**
       * get all tasks that are before the end of the clientDate
       */
      const before = new Date(body.clientDate);
      before.setUTCHours(23, 59, 59, 999);
      query.andWhere("due_date <= :before", { before: before.toISOString() });
    } else if (audience === "tomorrow") {
      // get the next day
      const tomorrow = new Date(body.clientDate);
      tomorrow.setDate(tomorrow.getDate() + 1);

      /**
       * get all tasks that are after the start of the clientDate
       */
      const after = new Date(tomorrow);
      after.setUTCHours(0, 0, 0, 1);
      query.andWhere("due_date >= :after", { after: after.toISOString() });

      /**
       * get all tasks that are before the end of the clientDate
       */
      const before = new Date(tomorrow);
      before.setUTCHours(23, 59, 59, 999);
      query.andWhere("due_date <= :before", { before: before.toISOString() });
    } else if (audience === "overdue") {
      /**
       * get all tasks that are after the start of the clientDate
       */
      const before = new Date(body.clientDate);
      before.setUTCHours(0, 0, 0, 1);
      query.andWhere("due_date <= :before", { before: before.toISOString() });

      /**
       * get tasks that are not completed
       */
      query.andWhere("is_completed = :isCompleted", { isCompleted: false }); // don't return completed tasks
    } else if (audience === "completed") {
      /**
       * get all tasks that are before the end of the clientDate
       */
      const before = new Date(body.clientDate);
      before.setUTCHours(23, 59, 59, 999);
      query.andWhere("completed_date <= :before", { before: before.toISOString() });

      /**
       * get all tasks that are after the start of the clientDate
       */
      const after = new Date(body.clientDate);
      after.setUTCHours(0, 0, 0, 1);
      query.andWhere("completed_date >= :after", { after: after.toISOString() });

      /**
       * get tasks that are completed
       */
      query.andWhere("is_completed = :is_completed", { is_completed: true }); // return only completed tasks
    }

    const tasks = await query.getMany();

    for (const task of tasks) {
      const taskShares = await TaskShareMapping.find({ where: { taskId: task.taskId, isActive: true } });
      const userIds = taskShares.map((taskShare) => taskShare.userId);
      returnFormattedTasks.push(formatTaskResponseWithUsers({ task, userIds }));
    }

    // get the tasks which were shared with the user. ie: external tasks by other users
    const shareMappings = await TaskShareMapping.find({ where: { userId: body.ownerId, isActive: true } });
    for (const mapping of shareMappings) {
      const task = await Task.findOne({ where: { taskId: mapping.taskId, clientId: variables.clientId } });
      if (task) {
        const taskShares = await TaskShareMapping.find({ where: { taskId: task.taskId, isActive: true } });
        const userIds = taskShares.map((taskShare) => taskShare.userId);
        returnFormattedTasks.push(formatTaskResponseWithUsers({ task, userIds }));
      }
    }

    return res.json({
      statusCode: 200,
      data: [...returnFormattedTasks],
      errors: [],
      pagination: null,
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something in GET /tasks" }],
    });
  }
}
