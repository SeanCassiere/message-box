import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import { formatChatMessagesResponse } from "#root/utils/formatResponses";
import ChatMessage from "#root/db/entities/ChatMessage";

import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    roomId: yup.string().required("RoomId is required"),
    sendResponse: yup.bool(),
  }),
  body: yup.object().shape({
    content: yup.string().required("Content is required"),
    type: yup.string().required("Content is required"),
    senderId: yup.string().required("SenderId is required"),
  }),
});

export async function createMessageForChatRoom(req: Request, res: Response) {
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

  let formatted: any;
  try {
    const message = await ChatMessage.create({
      roomId: variables.roomId,
      clientId: variables.clientId,
      content: body.content,
      contentType: body.type,
      senderId: body.senderId,
    }).save();

    formatted = message;
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [
        {
          propertyPath: "roomId",
          message: "internal server error",
        },
      ],
      pagination: null,
    });
  }

  if (variables?.sendResponse) {
    const newFormat = await formatChatMessagesResponse({ messages: [formatted], clientId: variables.clientId });
    formatted = newFormat[0];
  }

  createDbActivityLog({
    clientId: variables.clientId,
    userId: variables.userId,
    action: "chat-message-create",
    description: `Sent a chat message of ("${body.content}") to roomId:${variables?.roomId}`,
  }).then(() => {
    log.info(`Activity log created for userId: ${variables?.userId}`);
  });

  return res.json({
    statusCode: 200,
    data: variables?.sendResponse ? formatted : { success: true, messageId: `${formatted?.messageId}` },
    errors: [],
    pagination: null,
  });
}
