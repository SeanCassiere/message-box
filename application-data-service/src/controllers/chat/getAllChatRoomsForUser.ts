import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
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

  let roomIds: string[] = [];
  try {
    const findChatRoomMappings = await ChatRoomUserMapping.find({ where: { userId: body.ownerId, isDeleted: false } });
    roomIds = findChatRoomMappings.map((r) => r.roomId);
  } catch (error) {}

  let chatRooms: ChatRoom[] = [];

  log.error("RoomIDS");
  log.error(roomIds);

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
    formatted.push(await formatChatRoomResponse({ chatRoom: room, participants: [] }));
  }

  return res.json({
    statusCode: 200,
    data: formatted,
    errors: [],
    pagination: null,
  });
}
