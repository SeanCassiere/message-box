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
    taskId: yup.string().required("Task must have an owner"),
  }),
});

export async function getTaskById(req: Request, res: Response) {
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
    const task = await Task.findOne({ where: { taskId: body.taskId, clientId: variables.clientId } });

    if (!task) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [{ field: "taskId", message: `Not task found with the id of ${body.taskId}` }],
      });
    }

    const taskShareMappings = await TaskShareMapping.find({ where: { taskId: body.taskId } });
    const userIds = taskShareMappings.map((taskShareMapping) => taskShareMapping.userId);

    return res.json({
      statusCode: 200,
      data: formatTaskResponseWithUsers({ task, userIds }),
      errors: [],
      pagination: null,
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something in POST /tasks" }],
    });
  }
}
