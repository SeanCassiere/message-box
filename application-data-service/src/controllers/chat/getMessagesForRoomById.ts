import { Request, Response } from "express";
import * as yup from "yup";

import ChatMessage from "#root/db/entities/ChatMessage";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import { formatChatMessagesResponse } from "#root/utils/formatResponses";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    roomId: yup.string().required("RoomId is required"),
  }),
  body: yup.object().shape({
    size: yup.number().min(1).nullable(),
    cursor: yup.date().nullable(),
  }),
});

export async function getMessagesForRoomById(req: Request, res: Response) {
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

  const takeSize = req.body?.body?.size || 35;

  const dbQuery = ChatMessage.createQueryBuilder()
    .where("client_id = :clientId", { clientId: variables.clientId })
    .andWhere("room_id = :roomId", { roomId: variables.roomId });

  if (body?.cursor) {
    const cursor = new Date(body.cursor).toISOString();
    dbQuery.andWhere("created_at < :cursor", { cursor: cursor });
  }

  dbQuery.take(takeSize).orderBy("created_at", "DESC");

  let preChatMessages: ChatMessage[] = [];

  try {
    const messages = await dbQuery.getMany();
    preChatMessages = messages.reverse();
  } catch (error) {
    log.error(`There was an error fetching the messages`, error);
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

  const formattedMessages = await formatChatMessagesResponse({
    messages: preChatMessages,
    clientId: variables.clientId,
  });

  return res.json({
    statusCode: 200,
    data: formattedMessages,
    errors: [],
    pagination: null,
  });
}
