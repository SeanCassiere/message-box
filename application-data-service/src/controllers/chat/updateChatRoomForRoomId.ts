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
    roomId: yup.string().required("RoomId is required"),
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

export async function updateChatRoomForRoomId(req: Request, res: Response) {
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

  let users: BaseUserFromAuthServer[] = [];
  try {
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient`, {
      variables: {
        clientId: variables.clientId,
      },
    });

    users = response.data;
  } catch (error) {
    log.error(
      `POST /chat/createChatRoomForUser -> ${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient\n
      could not fetch the user ids for this client\n
      ${error}`
    );
  }

  const filterParticipants: string[] = body.participants.map((participantId: string) => {
    const user = users.find((user) => user.userId === participantId);
    if (user) {
      return participantId;
    }
    return "NOT";
  });
  const readyParticipants = filterParticipants.filter((participantId: string) => participantId !== "NOT");

  let foundChatRoom: ChatRoom | null = null;

  try {
    const chatRoom = await ChatRoom.findOneOrFail({
      where: { clientId: variables.clientId, roomId: variables.roomId, isDeleted: false },
    });

    chatRoom.roomName = body.roomName;
    await chatRoom.save();

    foundChatRoom = chatRoom;
  } catch (error) {
    log.error(`Error updating chat room ID ${variables.roomId}`, body);
    return res.json({
      statusCode: 500,
      data: null,
      errors: [
        {
          propertyPath: "roomId",
          message: "Chat room not found",
        },
        {
          propertyPath: "roomName",
          message: "Chat room not found",
        },
      ],
      pagination: null,
    });
  }

  const chatRoomId = variables.roomId;
  const deleteRoomMappingQuery = ChatRoomUserMapping.createQueryBuilder()
    .delete()
    .where("room_id = :roomId", { roomId: chatRoomId });

  try {
    await deleteRoomMappingQuery.execute();
  } catch (error) {
    log.error(`Error deleting old chat room mappings`, error);
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

  const insertRoomMappingQuery = ChatRoomUserMapping.createQueryBuilder()
    .insert()
    .values(
      readyParticipants.map((id) => ({
        roomId: `${chatRoomId}`,
        userId: id,
      }))
    );

  try {
    await insertRoomMappingQuery.execute();
    console.log(insertRoomMappingQuery.getQueryAndParameters());
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

  return res.json({
    statusCode: 200,
    data: await formatChatRoomResponse({ chatRoom: foundChatRoom!, participants: readyParticipants }),
    errors: [],
    pagination: null,
  });
}
