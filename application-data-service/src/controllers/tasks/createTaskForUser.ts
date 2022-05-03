import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import Task from "#root/db/entities/Task";
import TaskShareMapping from "#root/db/entities/TaskShareMappings";
import { formatTaskResponseWithUsers } from "#root/utils/formatResponses";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    ownerId: yup.string().required("Task must have an owner"),
    title: yup.string().required("Title is required"),
    content: yup.string(),
    bgColor: yup.string(),
    dueDate: yup.date().required("Due date is required"),
    sharedWith: yup.array().of(yup.string()),
  }),
});

export async function createTaskForUser(req: Request, res: Response) {
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

  let clientUserIds: string[] = [];
  try {
    const { data } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllUserIdsForClient`, {
      variables: {
        clientId: variables.clientId,
      },
    });

    clientUserIds = data;
  } catch (error) {
    log.error(
      `POST /clients/createTaskForUser -> ${AUTH_SERVICE_URI}/clients/getAllUserIdsForClient\ncould not fetch the user ids for this client`
    );
  }

  try {
    // save the task
    const task: Task = Task.create({
      ownerId: body.ownerId,
      title: body.title,
      dueDate: body.dueDate,
      clientId: variables.clientId,
    });
    if (body.content) {
      task.content = body.content;
    }
    if (body.bgColor) {
      task.bgColor = body.bgColor;
    }
    await task.save();

    // save the task share mappings
    const userIds = [];
    if (body.sharedWith && body.sharedWith.length > 0) {
      for (const userId of body.sharedWith) {
        if (clientUserIds.includes(userId)) {
          const mapping = await TaskShareMapping.create({
            taskId: task.taskId,
            userId,
          }).save();
          userIds.push(mapping.userId);
        }
      }
    }

    createDbActivityLog({
      clientId: variables.clientId,
      userId: variables.userId,
      action: "user-task-created",
      description: `Create a user task:${task.taskId}`,
    }).then(() => {
      log.info(`Activity log created for userId: ${variables?.userId}`);
    });

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
