import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";
import { BaseUserFromAuthServer } from "#root/types/users";
import ChatRoom from "#root/db/entities/ChatRoom";
import ChatRoomUserMapping from "#root/db/entities/ChatRoomUserMappings";
import { formatChatMessagesResponse, formatChatRoomResponse } from "#root/utils/formatResponses";
import ChatMessage from "#root/db/entities/ChatMessage";

// import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    roomId: yup.string().required("RoomId is required"),
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

  const dbQuery = ChatMessage.createQueryBuilder()
    .where("client_id = :clientId", { clientId: variables.clientId })
    .andWhere("room_id = :roomId", { roomId: variables.roomId })
    .take(60)
    .orderBy("created_at", "DESC");

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
