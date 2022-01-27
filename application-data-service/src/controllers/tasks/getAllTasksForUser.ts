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
    ownerId: yup.string(),
  }),
});

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

  const returnFormattedTasks = [];

  try {
    // get the owned tasks
    const tasks = await Task.find({ where: { ownerId: body.ownerId, clientId: variables.clientId, isDeleted: false } });

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
