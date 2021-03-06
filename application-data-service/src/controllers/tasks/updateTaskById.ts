import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import Task from "#root/db/entities/Task";
import TaskShareMapping from "#root/db/entities/TaskShareMappings";
import { formatTaskResponseWithUsers } from "#root/utils/formatResponses";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { returnStringsNotInOriginalArray } from "#root/utils/minorUtils";
import { log } from "#root/utils/logger";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    taskId: yup.string().required("TaskId is required"),
  }),
  body: yup.object().shape({
    ownerId: yup.string().required("Task must have an owner"),
    title: yup.string().required("Title is required"),
    content: yup.string(),
    bgColor: yup.string(),
    dueDate: yup.date().required("Due date is required"),
    isCompleted: yup.boolean().required("IsCompleted is required"),
    sharedWith: yup.array().of(yup.string()),
  }),
});

export async function updateTaskById(req: Request, res: Response) {
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

    clientUserIds = data.data;
  } catch (error) {
    log.error(
      `POST /clients/updateTaskById -> ${AUTH_SERVICE_URI}/clients/getAllUserIdsForClient\ncould not fetch the user ids for this client`
    );
  }

  try {
    // get and update the task
    const task = await Task.findOne({ where: { taskId: variables.taskId, clientId: variables.clientId } });

    if (!task) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [{ field: "taskId", message: `No Task found with the ID ${variables.taskId}` }],
      });
    }

    task.title = body.title || task.title;
    task.content = body.content || task.content;
    task.bgColor = body.bgColor || task.bgColor;
    task.dueDate = body.dueDate || task.dueDate;

    if (task.isCompleted === false && body.isCompleted === true) {
      task.completedDate = new Date(Date.now());
    }

    task.isCompleted = body.isCompleted;

    const savePromises = [];
    savePromises.push(task.save());

    // get and update the mappings
    let shareMappingHaveChanged = false;
    let userIds: string[] = [];
    const taskShareMappings = await TaskShareMapping.find({ where: { taskId: variables.taskId, isActive: true } });
    const taskShareMappingUserIds = taskShareMappings.map((mapping) => mapping.userId);

    // remove the mappings that are not in the new list
    const mappingsToRemove = returnStringsNotInOriginalArray(body.sharedWith, taskShareMappingUserIds);
    if (mappingsToRemove.length > 0) {
      shareMappingHaveChanged = true;
      for (const removeMappingId of mappingsToRemove) {
        if (clientUserIds.includes(removeMappingId)) {
          const taskShare = await TaskShareMapping.findOne({
            where: { userId: removeMappingId, isActive: true, taskId: variables.taskId },
          });
          if (taskShare) {
            taskShare.isActive = false;
            savePromises.push(taskShare.save());
          }
        }
      }
    }

    // add the new mappings that are not in the existing list
    const mappingsToAdd = returnStringsNotInOriginalArray(taskShareMappingUserIds, body.sharedWith);
    if (mappingsToAdd.length > 0) {
      shareMappingHaveChanged = true;
      for (const addMappingId of mappingsToAdd) {
        if (clientUserIds.includes(addMappingId)) {
          const newMapping = TaskShareMapping.create({
            taskId: variables.taskId,
            userId: addMappingId,
          });
          savePromises.push(newMapping.save());
        }
      }
    }

    try {
      await Promise.all(savePromises);
    } catch (error) {
      return res.json({
        statusCode: 500,
        data: null,
        errors: [{ field: "service", message: "Something went wrong in PUT /tasks" }],
      });
    }

    // if the mappings have changed that to refetch all the user ids
    if (shareMappingHaveChanged) {
      const refreshedMappings = await TaskShareMapping.find({ where: { taskId: variables.taskId, isActive: true } });
      userIds = refreshedMappings.map((map) => map.userId);
    } else {
      userIds = body.sharedWith || [];
    }

    createDbActivityLog({
      clientId: variables.clientId,
      userId: variables.userId,
      action: "user-task-updated",
      description: `Updated a user task:${task.taskId}`,
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
      errors: [{ field: "service", message: "Something in PUT /tasks" }],
    });
  }
}
