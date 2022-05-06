import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import ChatRoom from "#root/db/entities/ChatRoom";
import ChatRoomUserMapping from "#root/db/entities/ChatRoomUserMappings";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";
import { BaseUserFromAuthServer } from "#root/types/users";
import { formatChatRoomResponse } from "#root/utils/formatResponses";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";
import { createConversationChatRoomName } from "#root/utils/minorUtils";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    roomName: yup.string().required("RoomName is required"),
    participants: yup
      .array()
      .of(yup.string())
      .min(2, "At least 2 participants are required")
      .required("Participants are required"),
  }),
});

export async function createChatRoomForUser(req: Request, res: Response) {
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

  let usersFromAuthService: BaseUserFromAuthServer[] = [];
  try {
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient`, {
      variables: {
        clientId: variables.clientId,
      },
    });

    usersFromAuthService = response.data;
  } catch (error) {
    log.error(
      `POST /chat/createChatRoomForUser -> ${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient\n
      could not fetch the user ids for this client\n
      ${error}`
    );
  }

  const filterParticipants: string[] = body.participants.map((participantId: string) => {
    const user = usersFromAuthService.find((user) => user.userId === participantId);
    if (user) {
      return participantId;
    }
    return "NOT";
  });
  const readyParticipants = filterParticipants.filter((participantId: string) => participantId !== "NOT");
  let newRoomName =
    filterParticipants.length === 2 ? createConversationChatRoomName(body.roomName, filterParticipants) : body.roomName;
  const chatRoom = ChatRoom.create({ roomName: newRoomName, clientId: variables.clientId });
  try {
    await chatRoom.save();
  } catch (error) {
    log.error(`Error creating a chat room for UserID ${variables.userId}`, body);
    return res.json({
      statusCode: 500,
      data: null,
      errors: [
        {
          propertyPath: "roomName",
          message: "An unexpected error occurred",
        },
      ],
      pagination: null,
    });
  }

  const chatRoomId = chatRoom.roomId;
  const roomMappingQuery = ChatRoomUserMapping.createQueryBuilder()
    .insert()
    .values(
      readyParticipants.map((id) => ({
        roomId: `${chatRoomId}`,
        userId: id,
      }))
    );

  try {
    await roomMappingQuery.execute();
  } catch (error) {
    log.error(`Error creating chat room mappings`, error);
    return res.json({
      statusCode: 500,
      data: null,
      errors: [
        {
          propertyPath: "participants",
          message: "An unexpected error occurred",
        },
      ],
      pagination: null,
    });
  }

  createDbActivityLog({
    clientId: variables.clientId,
    userId: variables.userId,
    action: "chat-room-create",
    description: `Create chat room with roomId:${chatRoomId}, room-name is ${body.roomName}`,
  }).then(() => {
    log.info(`Activity log created for userId: ${variables?.userId}`);
  });

  return res.json({
    statusCode: 200,
    data: await formatChatRoomResponse({
      chatRoom,
      participants: readyParticipants,
      numberOfParticipants: readyParticipants.length,
      currentUserId: variables.userId,
      resolveUsersInChatName: usersFromAuthService,
    }),
    errors: [],
    pagination: null,
  });
}
