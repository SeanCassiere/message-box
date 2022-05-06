import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";
import { BaseUserFromAuthServer } from "#root/types/users";
import ChatRoom from "#root/db/entities/ChatRoom";
import ChatRoomUserMapping from "#root/db/entities/ChatRoomUserMappings";
import { formatChatRoomResponse } from "#root/utils/formatResponses";

// import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    roomId: yup.string().required("RoomId is required"),
  }),
});

export async function getSingleChatRoomForUser(req: Request, res: Response) {
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

  let chatRoom: ChatRoom | null = null;

  try {
    chatRoom = await ChatRoom.findOneOrFail({ where: { roomId: body.roomId, isDeleted: false } });
  } catch (error) {
    log.error(`Could not find chat RoomID ${body.roomId}`);
  }

  if (!chatRoom) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [
        {
          propertyPath: "roomId",
          message: "Could not find chat room",
        },
      ],
      pagination: null,
    });
  }

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

  let participants: string[] = [];

  try {
    const findParticipants = await ChatRoomUserMapping.find({ where: { roomId: chatRoom.roomId, isDeleted: false } });
    participants = findParticipants.map((p) => p.userId);
  } catch (error) {
    log.error(`Error could not fetch participants`);
  }

  return res.json({
    statusCode: 200,
    data: await formatChatRoomResponse({
      chatRoom,
      participants: participants,
      numberOfParticipants: participants.length,
      resolveUsersInChatName: usersFromAuthService,
      currentUserId: variables.userId,
    }),
    errors: [],
    pagination: null,
  });
}
