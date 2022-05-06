import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import ChatRoom from "#root/db/entities/ChatRoom";
import ChatRoomUserMapping from "#root/db/entities/ChatRoomUserMappings";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import { formatChatRoomResponse } from "#root/utils/formatResponses";
import { BaseUserFromAuthServer } from "#root/types/users";
import { AUTH_SERVICE_URI } from "#root/utils/constants";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    ownerId: yup.string().required("OwnerId is required"),
  }),
});

export async function getAllChatRoomsForUser(req: Request, res: Response) {
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

  let roomIds: string[] = [];
  try {
    const findChatRoomMappings = await ChatRoomUserMapping.find({ where: { userId: body.ownerId, isDeleted: false } });
    roomIds = findChatRoomMappings.map((r) => r.roomId);
  } catch (error) {}

  let chatRooms: ChatRoom[] = [];

  const chatRoomQuery = ChatRoom.createQueryBuilder().where("client_id = :client_id", {
    client_id: variables.clientId,
  });
  chatRoomQuery.andWhere("room_id IN (:...room_id)", { room_id: [...roomIds] });
  chatRoomQuery.andWhere("is_deleted = :is_deleted", { is_deleted: false });

  if (roomIds.length > 0) {
    try {
      const r = await chatRoomQuery.getMany();
      chatRooms = r;
    } catch (error) {
      log.error(error);
      log.error(`Error finding chat rooms`);
    }
  }

  const formatted: any[] = [];
  for (const room of chatRooms) {
    const numberOfParticipants = await ChatRoomUserMapping.count({ where: { roomId: room.roomId, isDeleted: false } });
    formatted.push(
      await formatChatRoomResponse({
        chatRoom: room,
        participants: [],
        numberOfParticipants: numberOfParticipants,
        resolveUsersInChatName: usersFromAuthService,
        currentUserId: variables.userId,
      })
    );
  }

  return res.json({
    statusCode: 200,
    data: formatted,
    errors: [],
    pagination: null,
  });
}
